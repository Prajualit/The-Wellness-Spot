const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

export const getMedia = async (section) => {
  try {
    const url = `${API_BASE}/media${section ? `?section=${section}` : ""}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.media || [];
  } catch (error) {
    return [];
  }
};
