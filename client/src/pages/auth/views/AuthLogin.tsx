import Logo from "@/components/Logo";
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
                <CardTitle className="flex items-center gap-2">
                    <Logo />
                    <h1 className="text-2xl">Yapless</h1>
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4">
                <img
                    src="/login-thumbnail.jpg"
                    className="object-cover rounded-lg w-full h-48"
                />
            </CardContent>
            <CardFooter className="px-4">
                <GoogleLoginBtn />
            </CardFooter>
        </>
    );
};

export default AuthLogin;
