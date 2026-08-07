export const getApiBaseURL = () => {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";
    }
    return "/api/v1";
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";
};
