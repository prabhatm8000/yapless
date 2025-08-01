import { Route, Routes } from "react-router";
import ErrorPage, { PageDataContants } from "../ErrorPage";
import LegalLayout from "./LegalLayout";
import Privacy from "./views/Privacy";
import Terms from "./views/Terms";

const LegalRoutes = () => {
    return (
        <Routes>
            <Route
                path="terms"
                element={
                    <LegalLayout>
                        <Terms />
                    </LegalLayout>
                }
            />
            <Route
                path="privacy"
                element={
                    <LegalLayout>
                        <Privacy />
                    </LegalLayout>
                }
            />
            <Route
                path="*"
                element={<ErrorPage pageData={PageDataContants.PageNotFound} />}
            />
        </Routes>
    );
};

export default LegalRoutes;
