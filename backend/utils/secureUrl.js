export const toSecureUrl = (url) => {
  if (typeof url !== "string") return url;
  return /^http:\/\//i.test(url) ? "https://" + url.slice(7) : url;
};
