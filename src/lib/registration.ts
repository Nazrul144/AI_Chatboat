export interface BusinessRegistrationPayload {
  username: string;
  password: string;
  email: string;
  phone_number: string;
  business_name: string;
  business_description: string;
  website_url?: string;
}

export interface BusinessRegistrationResponse {
  username: string;
  email: string;
  phone_number: string;
  business_name: string;
  business_description: string;
  website_url?: string;
}

export interface RegistrationFormInput {
  username: string;
  password: string;
  email: string;
  phone: string;
  businessName: string;
  businessDescription: string;
  website?: string;
}

export function getBackendApiBase(): string {
  return (
    process.env.NEXT_PUBLIC_BACKEND_API_URL ??
    "http://13.61.225.84:8000/api/v1"
  ).replace(/\/+$/, "");
}

function normalizeWebsiteUrl(url?: string): string | undefined {
  const trimmed = url?.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function mapFormToPayload(
  form: RegistrationFormInput,
): BusinessRegistrationPayload {
  const payload: BusinessRegistrationPayload = {
    username: form.username.trim(),
    password: form.password,
    email: form.email.trim(),
    phone_number: form.phone.trim(),
    business_name: form.businessName.trim(),
    business_description: form.businessDescription.trim(),
  };

  const website = normalizeWebsiteUrl(form.website);
  if (website) payload.website_url = website;

  return payload;
}

function parseApiError(data: unknown, status: number): string {
  if (!data || typeof data !== "object") {
    return `Registration failed (${status}). Please try again.`;
  }

  const record = data as Record<string, unknown>;

  if (typeof record.detail === "string") return record.detail;
  if (typeof record.error === "string") return record.error;

  const fieldMessages = Object.entries(record).flatMap(([field, value]) => {
    if (Array.isArray(value)) {
      return value.map((item) => `${field}: ${String(item)}`);
    }
    if (typeof value === "string") {
      return [`${field}: ${value}`];
    }
    return [];
  });

  if (fieldMessages.length > 0) return fieldMessages.join(". ");

  return `Registration failed (${status}). Please try again.`;
}

export async function submitBusinessRegistration(
  form: RegistrationFormInput,
): Promise<BusinessRegistrationResponse> {
  const body = mapFormToPayload(form);

  const response = await fetch("/api/proxy/businesses/requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => null)) as
    | (BusinessRegistrationResponse & Record<string, unknown>)
    | null;

  if (!response.ok) {
    throw new Error(parseApiError(data, response.status));
  }

  if (!data?.email) {
    throw new Error("Registration failed. Invalid response from server.");
  }

  return data;
}
