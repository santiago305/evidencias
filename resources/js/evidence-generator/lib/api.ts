export async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
    },
  });

  const payload = await response.json();
  if (!response.ok) {
    throw payload;
  }

  return payload as T;
}

export async function postJson<T>(url: string, body: unknown): Promise<T> {
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {}),
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw payload;
  }

  return payload as T;
}

export async function putJson<T>(url: string, body: unknown): Promise<T> {
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const response = await fetch(url, {
    method: "PUT",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {}),
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw payload;
  }

  return payload as T;
}
