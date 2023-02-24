export type PeraOnrampAssets = "ALGO" | "USDC-A" | "USDT-A";

export interface PeraOnrampConstructorOptions {
  availableAssets?: PeraOnrampAssets[];
  optInEnabled?: boolean;
  platform?: "package" | "web" | "mobile" | "ios" | "android";
}

export interface PeraOnrampAddFundsParams {
  accountAddress: string;
}

export type PeraOnrampCallbacks = {
  ADD_FUNDS_COMPLETED?: () => void;
  ADD_FUNDS_FAILED?: () => void;
  OPT_IN_REQUEST?: ({
    accountAddress,
    assetID
  }: {
    accountAddress: string;
    assetID: string;
  }) => void;
};

export type PeraOnrampListenerPromiseResolve = {
  type: "ADD_FUNDS_COMPLETED";
  message: string;
};

export type PeraOnrampListenerPromiseReject = {
  type: "MODAL_CLOSED";
  error: Error;
};
