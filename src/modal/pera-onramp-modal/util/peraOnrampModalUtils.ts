import PeraOnrampModal from "../PeraOnrampModal";
import PERA_ONRAMP_MODAL_ATTRIBUTES from "./peraOnrampModalConstants";

function setIframeSrc({
  baseUrl,
  iframe,
  accountAddress,
  availableAssets,
  platform,
  optInEnabled
}: {
  baseUrl: string;
  iframe: HTMLIFrameElement;
  accountAddress: PeraOnrampModalAttributes["ACCOUNT_ADDRESS"];
  availableAssets: PeraOnrampModalAttributes["AVAILABLE_ASSETS"];
  platform: PeraOnrampModalAttributes["PLATFORM"];
  optInEnabled: PeraOnrampModalAttributes["OPT_IN_ENABLED"];
}) {
  const iframeSrc = new URL(baseUrl);

  iframeSrc.searchParams.set(PERA_ONRAMP_MODAL_ATTRIBUTES.ADDRESS, accountAddress);

  iframeSrc.searchParams.set(
    PERA_ONRAMP_MODAL_ATTRIBUTES.AVAILABLE_ASSETS,
    availableAssets
  );

  if (hasWindowPeraWalletOrigin()) {
    iframeSrc.searchParams.set(PERA_ONRAMP_MODAL_ATTRIBUTES.PLATFORM, "web-wallet");
  } else {
    iframeSrc.searchParams.set(PERA_ONRAMP_MODAL_ATTRIBUTES.PLATFORM, platform);
  }

  iframeSrc.searchParams.set(PERA_ONRAMP_MODAL_ATTRIBUTES.OPT_IN_ENABLED, optInEnabled);

  iframe.setAttribute("src", iframeSrc.toString());
}

function hasWindowPeraWalletOrigin() {
  return window.location.origin.includes("web.perawallet.app");
}

function appendPeraOnrampModalIfNotExists({
  accountAddress,
  availableAssets,
  optInEnabled,
  platform
}: {
  accountAddress: PeraOnrampModalAttributes["ACCOUNT_ADDRESS"];
  availableAssets: PeraOnrampModalAttributes["AVAILABLE_ASSETS"];
  optInEnabled: PeraOnrampModalAttributes["OPT_IN_ENABLED"];
  platform: PeraOnrampModalAttributes["PLATFORM"];
}) {
  if (
    !document.body.contains(
      document.querySelector("pera-onramp-modal") as PeraOnrampModal
    )
  ) {
    const peraOnrampModalWrapper = document.createElement("div");

    peraOnrampModalWrapper.className = "pera-onramp-modal-wrapper";

    const peraOnrampModalElement = document.createElement(
      "pera-onramp-modal"
    ) as PeraOnrampModal;

    peraOnrampModalElement.setAttribute("account-address", accountAddress);
    peraOnrampModalElement.setAttribute("available-assets", availableAssets);
    peraOnrampModalElement.setAttribute("opt-in-enabled", optInEnabled);
    peraOnrampModalElement.setAttribute("platform", platform);

    peraOnrampModalWrapper.appendChild(peraOnrampModalElement);
    document.body.appendChild(peraOnrampModalWrapper);
  }
}

export {setIframeSrc, hasWindowPeraWalletOrigin, appendPeraOnrampModalIfNotExists};
