import { Suspense } from "react";
import LoadingPage from "../pages/LoadingPage";

const SuspenseWrapper = ({
    children,
    element,
}: {
    children: React.ReactNode;
    element?: React.ReactNode;
}) => {
    return (
        <Suspense fallback={element || <LoadingPage />}>{children}</Suspense>
    );
};

export default SuspenseWrapper;
