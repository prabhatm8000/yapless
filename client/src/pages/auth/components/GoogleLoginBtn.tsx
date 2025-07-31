import { Button } from "@/components/ui/button";
import type { IUserState } from "@/redux/reducers/types";
import type { AppDispatch } from "@/redux/store";
import { login } from "@/redux/thunks/userThunk";
import { GoogleLogin } from "@react-oauth/google";
import { useRef } from "react";
import { IoLogoGoogle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const GoogleLoginBtn = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user: IUserState = useSelector((state: any) => state.user);
    const googleBtnRef = useRef<HTMLDivElement>(null);
    const handleGoogleLogin = (credentialRes: any) => {
        const { credential } = credentialRes;
        dispatch(login({ credential }));
    };
    const handleCtkBtn = () => {
        // clicking the google login button
        googleBtnRef.current?.getElementsByTagName("div")?.[3].click();
    };

    return (
        <>
            <span ref={googleBtnRef} style={{ display: "none" }}>
                <GoogleLogin
                    onSuccess={(credentialRes) =>
                        handleGoogleLogin(credentialRes)
                    }
                    onError={() => toast.error("Something went wrong")}
                />
            </span>
            <Button
                onClick={handleCtkBtn}
                disabled={user?.loading}
                type="button"
                className="w-full px-4 flex items-center justify-center gap-2"
            >
                <IoLogoGoogle />
                <span>Login with Google</span>
            </Button>
        </>
    );
};

export default GoogleLoginBtn;
