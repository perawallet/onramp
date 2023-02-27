import appTellerManager from "./core/util/network/teller/appTellerManager";
import PeraOnrampError from "./core/util/PeraOnrampError";
import {PERA_ONRAMP_MODAL_CLASSNAMES} from "./modal/pera-onramp-modal/util/peraOnrampModalConstants";
import {appendPeraOnrampModalIfNotExists} from "./modal/pera-onramp-modal/util/peraOnrampModalUtils";
import {DEFAULT_AVAILABLE_ASSETS} from "./peraOnrampConstants";
import {
  PeraOnrampAddFundsParams,
  PeraOnrampCallbacks,
  PeraOnrampConstructorOptions
} from "./peraOnrampTypes";

class PeraOnramp {
  messagePromise: Promise<any>;
  messageResolve: (value: "ADDING_FUNDS_COMPLETED") => void;
  messageReject: (reason: Error) => void;
  availableAssets = DEFAULT_AVAILABLE_ASSETS;
  optInEnabled: PeraOnrampConstructorOptions["optInEnabled"];
  platform: PeraOnrampConstructorOptions["platform"];

  constructor(options?: PeraOnrampConstructorOptions) {
    if (options?.availableAssets && options?.availableAssets.length) {
      this.availableAssets = options.availableAssets;
    }

    this.optInEnabled = options?.optInEnabled || false;

    this.platform = options?.platform || "package";

    this.messagePromise = new Promise((resolve, reject) => {
      this.messageResolve = resolve;
      this.messageReject = reject;
    });

    // CONTINUE_CLICKED_AFTER_ADD_FUNDS_COMPLETED message is needed both with "on" method being used and without it
    // in constructor, it will be set if "on" method is not used
    appTellerManager.setupListener({
      onReceiveMessage: (messageEvent) => {
        const {message} = messageEvent.data;

        if (message.type === "CONTINUE_CLICKED_AFTER_ADD_FUNDS_COMPLETED") {
          this.messageResolve("ADDING_FUNDS_COMPLETED");
        }
      }
    });
  }

  public addFunds({accountAddress}: PeraOnrampAddFundsParams): Promise<any> {
    appendPeraOnrampModalIfNotExists({
      accountAddress,
      availableAssets: this.availableAssets!.join(","),
      optInEnabled: this.optInEnabled!.toString(),
      platform: this.platform!
    });

    const peraOnrampModalCloseButton = document
      .querySelector("pera-onramp-modal")
      ?.shadowRoot?.querySelector(
        `${PERA_ONRAMP_MODAL_CLASSNAMES.PERA_ONRAMP_MODAL.QUERY_SELECTOR} ${PERA_ONRAMP_MODAL_CLASSNAMES.PERA_ONRAMP_MODAL_CLOSE_BUTTON.QUERY_SELECTOR}`
      ) as HTMLButtonElement;

    peraOnrampModalCloseButton.addEventListener("click", () => {
      this.messageReject(
        new PeraOnrampError(
          {type: "MODAL_CLOSED_BY_USER", detail: "Modal closed by user"},
          "Modal closed by user"
        )
      );
    });

    return this.messagePromise;
  }

  public on(callbacks: PeraOnrampCallbacks): void {
    appTellerManager.setupListener({
      onReceiveMessage: (messageEvent) => {
        const {message} = messageEvent.data;

        if (message.type === "OPT_IN_REQUEST" && callbacks.OPT_IN_REQUEST) {
          // eslint-disable-next-line new-cap
          callbacks.OPT_IN_REQUEST({
            accountAddress: message.accountAddress,
            assetID: message.assetID
          });
        }

        if (message.type === "ADD_FUNDS_COMPLETED" && callbacks.ADD_FUNDS_COMPLETED) {
          // eslint-disable-next-line new-cap
          callbacks.ADD_FUNDS_COMPLETED();
        }

        if (message.type === "ADD_FUNDS_FAILED" && callbacks.ADD_FUNDS_FAILED) {
          // eslint-disable-next-line new-cap
          callbacks.ADD_FUNDS_FAILED();
        }

        // in case "on" method is used, CONTINUE_CLICKED_AFTER_ADD_FUNDS_COMPLETED message event will be set here. It overrides the one set in constructor
        if (message.type === "CONTINUE_CLICKED_AFTER_ADD_FUNDS_COMPLETED") {
          this.messageResolve("ADDING_FUNDS_COMPLETED");
        }
      }
    });
  }

  public close() {
    const peraOnrampModalWrapper = document.querySelector(".pera-onramp-modal-wrapper");

    if (peraOnrampModalWrapper) {
      peraOnrampModalWrapper.remove();

      this.messageReject(
        new PeraOnrampError(
          {
            type: "MODAL_CLOSED_PROGRAMMATICALLY",
            detail: "Modal closed programmatically"
          },
          "Modal closed programmatically"
        )
      );
    }
  }
}

export default PeraOnramp;
