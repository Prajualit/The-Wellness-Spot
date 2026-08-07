import { getApiBaseURL } from "./apiConfig.js";

export const getMedia = async (section) => {
  try {
    const url = `${getApiBaseURL()}/media${section ? `?section=${section}` : ""}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.media || [];
  } catch (error) {
    return [];
  }
};
