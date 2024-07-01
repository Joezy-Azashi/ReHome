import { isLoggedIn } from "../../services/auth";
import authContext from "../../contexts/authContext";

export default function ProvideAuth({ children }) {
    const auth = isLoggedIn();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}