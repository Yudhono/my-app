// Mayar Headless API — Invoice Create
// Docs: https://docs.mayar.id/api-reference/introduction
// Sandbox base: https://api.mayar.club/hl/v1
// Production base: https://api.mayar.id/hl/v1

const BASE_URL = "https://api.mayar.club/hl/v1";

type MayarItem = {
  name: string;
  description: string;
  quantity: number;
  rate: number;
};

type CreatePaymentLinkParams = {
  name: string;
  email: string;
  mobile: string;
  description: string;
  items: MayarItem[];
};

export async function createPaymentLink({
  name,
  email,
  mobile,
  description,
  items,
}: CreatePaymentLinkParams): Promise<string | null> {
  const apiKey = process.env.MAYAR_API_KEY;
  if (!apiKey) {
    console.error("[mayar] MAYAR_API_KEY is not set");
    return null;
  }

  try {
    const res = await fetch(`${BASE_URL}/invoice/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ name, email, mobile, description, items }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`[mayar] API error ${res.status}: ${text}`);
      return null;
    }

    const json = await res.json();
    return (json?.data?.link ?? null) as string | null;
  } catch (err) {
    console.error("[mayar] Unexpected error:", err);
    return null;
  }
}
