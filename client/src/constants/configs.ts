const configs = {
    mode: import.meta.env.VITE_MODE || "dev",
    // devBaseUrl: "http://localhost:8000/api/v1",
    devBaseUrl: "https://yapless-1.onrender.com/api/v1",
    serverBaseUrl: "https://yapless-1.onrender.com/api/v1",
    googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
};

export default configs;
