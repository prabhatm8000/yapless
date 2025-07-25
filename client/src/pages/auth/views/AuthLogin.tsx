import {
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import GoogleLoginBtn from "../components/GoogleLoginBtn";

const AuthLogin = () => {
    return (
        <>
            <CardHeader>
                <CardTitle>
                    <h1 className="text-4xl text-center">Login</h1>
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4"></CardContent>
            <CardFooter className="flex-col gap-1 px-4">
                <GoogleLoginBtn />
            </CardFooter>
        </>
    );
};

export default AuthLogin;
