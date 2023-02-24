interface PeraOnrampErrorData {
  type: "MODAL_CLOSED_BY_USER" | "MODAL_CLOSED_PROGRAMMATICALLY";
  detail?: any;
}

class PeraOnrampError extends Error {
  data: PeraOnrampErrorData;

  constructor(data: PeraOnrampErrorData, message: string, ...args: any[]) {
    super(...args);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PeraOnrampError);
    }

    this.name = "PeraOnrampError";
    this.data = data;
    this.message = message;
  }
}

export default PeraOnrampError;
