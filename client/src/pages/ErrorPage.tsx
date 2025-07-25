import { useEffect, useState } from "react";
import { PiLinkBreak } from "react-icons/pi";
import { Link, useSearchParams } from "react-router";

type PageDataType = {
    code?: number | string;
    title?: string;
    description?: string;
    homepageLink?: boolean;
};

export const PageDataContants = {
    PageNotFound: {
        code: 404,
        title: "Page Not Found",
        description: "The page you are looking for does not exist.",
    },
    InternalServerError: {
        code: 500,
        title: "Internal Server Error",
        description: "Something went wrong on the server.",
    },
    Unauthorized: {
        code: 401,
        title: "Unauthorized",
        description: "You are not authorized.",
    },
    Forbidden: {
        code: 403,
        title: "Forbidden",
        description: "You are not authorized to access this page.",
    },
    BadRequest: {
        code: 400,
        title: "Bad Request",
        description: "The request you made is invalid.",
    },
};

/**
 * Pass title, description and homepageLink as query params
 * Or pass title, description and homepageLink in pageData as props
 */
const ErrorPage = ({ pageData }: { pageData?: PageDataType }) => {
    const [searchParams, _] = useSearchParams();
    const [pageDataState, setPageDataState] = useState<PageDataType>({
        code: pageData?.code || "",
        title: pageData?.title || "Something went wrong",
        description:
            pageData?.description ||
            "The page you are looking fell in the void.",
        homepageLink: pageData?.homepageLink || true,
    });

    useEffect(() => {
        if (pageData) return;
        const title = searchParams.get("title");
        const description = searchParams.get("description");
        const homepageLink = searchParams.get("homepageLink");
        const code = searchParams.get("code");
        setPageDataState({
            code: code || "",
            title: title || "Something went wrong",
            description:
                description || "The page you are looking fell in the void.",
            homepageLink: homepageLink === "true",
        });
    }, [searchParams]);
    return (
        <div className="h-dvh">
            <div className="flex flex-col items-center justify-center gap-14 mt-20 p-10">
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-7xl">{pageDataState.code}</h1>
                    <h3 className="text-3xl">{pageDataState.title}</h3>
                    <p className="text-muted-foreground mt-5 text-center">
                        {pageDataState.description} <br />
                        {pageDataState.homepageLink && (
                            <>
                                Click{" "}
                                <Link to="/" className="text-blue-400">
                                    here
                                </Link>{" "}
                                to go back to the homepage.
                            </>
                        )}
                    </p>
                </div>
                <PiLinkBreak className="" size={150} />
            </div>
        </div>
    );
};

export default ErrorPage;
