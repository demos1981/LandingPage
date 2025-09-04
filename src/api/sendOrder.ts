import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();

  const message = `
🛒 Нове замовлення:
📦 Товар: ${data.product}
👤 Ім'я: ${data.name}
📞 Телефон: ${data.phone}
🏙️ Місто: ${data.city}
📮 Відділення: ${data.postOffice}
  `;

  const TELEGRAM_TOKEN = import.meta.env.TELEGRAM_TOKEN;
  const CHAT_ID = import.meta.env.TELEGRAM_CHAT_ID;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
};
