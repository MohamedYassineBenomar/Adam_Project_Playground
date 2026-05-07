const BASE = "/api";

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) Object.assign(headers, authHeader());

  const response = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      (data && (data.detail || Object.values(data).flat().join(" "))) ||
      `Request failed (${response.status})`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  register: (payload) => request("/register", { method: "POST", body: payload }),
  login: (payload) => request("/login", { method: "POST", body: payload }),
  products: () => request("/products"),
  createProduct: (payload) =>
    request("/products", { method: "POST", body: payload, auth: true }),
  reviews: (storeId) => request(`/reviews?store_id=${storeId}`),
  profile: () => request("/profile", { auth: true }),
  updateProfile: (payload) =>
    request("/profile", { method: "PUT", body: payload, auth: true }),
};
