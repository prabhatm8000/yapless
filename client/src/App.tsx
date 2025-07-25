import { GoogleOAuthProvider } from "@react-oauth/google";
import { lazy } from "react";
import { Provider } from "react-redux";
import SuspenseWrapper from "./components/SuspenseWrapper";
import configs from "./constants/configs";
import { ThemeProvider } from "./contexts/ThemeProvider";
import store from "./redux/store";

const AppRouter = lazy(() => import("./AppRouter"));

const App = () => {
    return (
        <div>
            <ThemeProvider>
                <Provider store={store}>
                    <GoogleOAuthProvider clientId={configs.googleClientId}>
                        <SuspenseWrapper>
                            <AppRouter />
                        </SuspenseWrapper>
                    </GoogleOAuthProvider>
                </Provider>
            </ThemeProvider>
        </div>
    );
};

export default App;
