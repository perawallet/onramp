import "./core/ui/style/color/_global-colors.scss";
import "./modal/pera-onramp-modal/_pera-onramp-modal-wrapper.scss";

import defineCustomElements from "./App";
import PeraOnramp from "./PeraOnramp";

if (typeof window !== "undefined") {
  defineCustomElements();
}

export {PeraOnramp};
