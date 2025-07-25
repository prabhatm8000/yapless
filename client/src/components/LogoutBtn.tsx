import { IoIosLogOut } from "react-icons/io";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { logout } from "../redux/thunks/userThunk";
import { Button } from "./ui/button";

const LogoutBtn = (props: React.ComponentProps<"button">) => {
    const dispatch = useDispatch<AppDispatch>();
    const handleLogout = () => {
        dispatch(logout()).then(() => {
            window.location.href = "/";
        });
    };
    return (
        <Button
            variant={"destructive"}
            onClick={handleLogout}
            {...props}
            className={"flex items-center gap-2 " + props?.className}
        >
            <IoIosLogOut />
            <span>Logout</span>
        </Button>
    );
};

export default LogoutBtn;
