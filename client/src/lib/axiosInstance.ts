import axios from "axios";
import { toast } from "sonner";
import configs from "../constants/configs";

const handleAndShowToast = (jsonPayload: any) => {
    const message = jsonPayload.message;
    const title = message?.title || message;
    const description =
        message?.description ||
        new Date().toLocaleString().split(",").join(" •");
    const duration = message?.toastDuration;

    if (jsonPayload.success) {
        toast.success(title, {
            description,
            duration,
        });
    } else {
        toast.error(title, {
            description,
            duration,
        });
    }
};

const axiosInstance = axios.create({
    baseURL:
        configs.mode === "dev" ? configs.devBaseUrl : configs.serverBaseUrl, // same server for both [as]
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
    transformResponse: (payload: any) => {
        const jsonPayload = JSON.parse(payload);
        try {
            if (!jsonPayload.message) {
                return jsonPayload;
            }
            handleAndShowToast(jsonPayload);
            return jsonPayload;
        } catch (error) {
            return jsonPayload;
        }
    },
});

export default axiosInstance;
