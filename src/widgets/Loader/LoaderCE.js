import getCustomElementFromWidget from "../utils/getCustomElementFromWidget"
import Loader from "./Loader"

export const LoaderCE = getCustomElementFromWidget({ Widget: Loader, className: "Loader-CE" });
export default LoaderCE;
