// URL base de la API REST. El proxy de Vite reenvia /api a localhost:8000
const URL_BASE = "http://localhost:8000";

// Helper que construeix el header Authorization si tenim token
function headerAutoritzacio(token) {
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

// ── Autenticació ───────────────────────────────────────────────

export async function apiRegistre(dades) {
  const url = `${URL_BASE}/api/registre/`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dades),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(extreuMissatge(data));
  }
  return data;
}

export async function apiLogin(correu, contrasenya) {
  const url = `${URL_BASE}/api/login/`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correu, contrasenya }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(extreuMissatge(data));
  }
  return data;
}

// ── Categories ─────────────────────────────────────────────────

export async function apiCategories() {
  const url = `${URL_BASE}/api/categories/`;
  const response = await fetch(url, { method: "GET" });
  if (!response.ok) {
    throw new Error(`Error ${response.status}`);
  }
  return await response.json();
}

// ── Productes ──────────────────────────────────────────────────

export async function apiProductes() {
  const url = `${URL_BASE}/api/productes/`;
  const response = await fetch(url, { method: "GET" });
  if (!response.ok) {
    throw new Error(`Error ${response.status}`);
  }
  return await response.json();
}

export async function apiCreateProducte(dades, token) {
  const url = `${URL_BASE}/api/productes/add/`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headerAutoritzacio(token),
    },
    body: JSON.stringify(dades),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(extreuMissatge(data));
  }
  return data;
}

// ── Ressenyes ──────────────────────────────────────────────────

export async function apiRessenyes(botigaId) {
  const url = `${URL_BASE}/api/ressenyes/?botiga_id=${botigaId}`;
  const response = await fetch(url, { method: "GET" });
  if (!response.ok) {
    throw new Error(`Error ${response.status}`);
  }
  return await response.json();
}

// ── Perfil ─────────────────────────────────────────────────────

export async function apiPerfil(token) {
  const url = `${URL_BASE}/api/perfil/`;
  const response = await fetch(url, {
    method: "GET",
    headers: headerAutoritzacio(token),
  });
  if (!response.ok) {
    throw new Error(`Error ${response.status}`);
  }
  return await response.json();
}

export async function apiUpdatePerfil(dades, token) {
  const url = `${URL_BASE}/api/perfil/update/`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...headerAutoritzacio(token),
    },
    body: JSON.stringify(dades),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(extreuMissatge(data));
  }
  return data;
}

// Extreu un missatge d'error llegible de la resposta del backend
function extreuMissatge(data) {
  if (!data) {
    return "Error desconegut";
  }
  if (data.error) {
    return data.error;
  }
  // Per errors de validació de DRF (camp -> [missatges])
  const valors = Object.values(data).flat();
  return valors.length > 0 ? valors.join(" ") : "Error desconegut";
}
