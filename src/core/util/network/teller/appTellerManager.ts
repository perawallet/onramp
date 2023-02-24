import Teller from "./Teller";

export type PeraOnrampTeller =
  | {
      type: "OPT_IN_REQUEST";
      accountAddress: string;
      assetID: string;
    }
  | {type: "OPT_IN_COMPLETED"}
  | {type: "OPT_IN_FAILED"}
  | {type: "ADD_FUNDS_REQUEST"}
  | {type: "ADD_FUNDS_COMPLETED"}
  | {type: "CONTINUE_CLICKED_AFTER_ADD_FUNDS_COMPLETED"}
  | {type: "ADD_FUNDS_FAILED"}
  | {type: "MESSAGE_RECEIVED"};

const appTellerManager = new Teller<PeraOnrampTeller>({
  channel: "pera-onramp"
});

export default appTellerManager;
