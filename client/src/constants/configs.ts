const configs = {
    mode: import.meta.env.VITE_MODE || "dev",
    devBaseUrl: "http://localhost:8000/api/v1",
    serverBaseUrl: "/api/v1",
    googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
};

export default configs;
