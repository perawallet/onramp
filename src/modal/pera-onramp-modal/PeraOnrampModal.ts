import closeButtonIcon from "../../asset/icons/close.svg";
import closeButtonIconDark from "../../asset/icons/close--dark.svg";

import {hasWindowPeraWalletOrigin, setIframeSrc} from "./util/peraOnrampModalUtils";
import PERA_ONRAMP_MODAL_ATTRIBUTES, {
  IFRAME_BASE_URL,
  PERA_ONRAMP_MODAL_CLASSNAMES
} from "./util/peraOnrampModalConstants";
import styles from "./_pera-onramp-modal.scss";
import {isSmallScreen} from "../../core/util/screen/screenSizeUtils";

const peraOnrampModalTemplate = document.createElement("template");

class PeraOnrampModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.render();

    if (this.shadowRoot) {
      const styleSheet = document.createElement("style");

      styleSheet.textContent = styles;

      this.shadowRoot.append(peraOnrampModalTemplate.content.cloneNode(true), styleSheet);
    }
  }

  private getGenericAttribute<T extends keyof typeof PERA_ONRAMP_MODAL_ATTRIBUTES>(
    attribute: T
  ): string {
    return this.getAttribute(PERA_ONRAMP_MODAL_ATTRIBUTES[attribute]) as string;
  }

  connectedCallback() {
    if (this.shadowRoot) {
      const closeButton = this.shadowRoot.querySelector(
        PERA_ONRAMP_MODAL_CLASSNAMES.PERA_ONRAMP_MODAL_CLOSE_BUTTON.QUERY_SELECTOR
      );
      const iframe = this.shadowRoot.querySelector(
        PERA_ONRAMP_MODAL_CLASSNAMES.PERA_ONRAMP_MODAL_IFRAME.QUERY_SELECTOR
      ) as HTMLIFrameElement;

      setIframeSrc({
        baseUrl: IFRAME_BASE_URL,
        iframe,
        accountAddress: this.getGenericAttribute("ADDRESS"),
        availableAssets: this.getGenericAttribute("AVAILABLE_ASSETS"),
        platform: this.getGenericAttribute("PLATFORM"),
        optInEnabled: this.getGenericAttribute("OPT_IN_ENABLED")
      });

      closeButton!.addEventListener("click", () => {
        this.closeModal();
      });

      this.render();
    }
  }

  private render() {
    peraOnrampModalTemplate.innerHTML = `
      <div class="${PERA_ONRAMP_MODAL_CLASSNAMES.PERA_ONRAMP_MODAL.CLASSNAME}${
      hasWindowPeraWalletOrigin() ? " pera-onramp-modal--web-wallet" : ""
    }" >
        <iframe class=${
          PERA_ONRAMP_MODAL_CLASSNAMES.PERA_ONRAMP_MODAL_IFRAME.CLASSNAME
        }></iframe>

        <button class=${
          PERA_ONRAMP_MODAL_CLASSNAMES.PERA_ONRAMP_MODAL_CLOSE_BUTTON.CLASSNAME
        }>
          <img
            class=${
              PERA_ONRAMP_MODAL_CLASSNAMES.PERA_ONRAMP_MODAL_CLOSE_BUTTON_ICON.CLASSNAME
            }
            src="${isSmallScreen() ? closeButtonIconDark : closeButtonIcon}"
            alt="close button"
          />
        </button>
      </div>
    `;
  }

  private closeModal() {
    const peraOnrampModalWrapper = document.querySelector(".pera-onramp-modal-wrapper");

    if (peraOnrampModalWrapper) {
      peraOnrampModalWrapper.remove();
    }
  }
}

export default PeraOnrampModal;
