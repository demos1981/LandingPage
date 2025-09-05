import type { APIRoute } from "astro";

const TELEGRAM_TOKEN = import.meta.env.TELEGRAM_TOKEN;
const CHAT_ID = import.meta.env.TELEGRAM_CHAT_ID;

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ status: "API is working ✅" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    console.log("✅ Полученные данные:", data); // 👈 логим данные формы
    const message = `
 Нове замовлення:
 Товар: ${data.product}
 Ім'я: ${data.name}
 Телефон: ${data.phone}
 Місто: ${data.city}
 Відділення: ${data.postOffice}
`;
    // Проверим, что все поля на месте
    const requiredFields = ["product", "name", "phone", "city", "postOffice"];
    for (const field of requiredFields) {
      if (!data[field]) {
        return new Response(
          JSON.stringify({ success: false, error: `Missing field: ${field}` }),
          { status: 400 }
        );
      }
    }
    const TELEGRAM_TOKEN = "7802829344:AAFamcBwNfKhVR8tgB4wPr3Va4MDOBlALOM"; // не публикуй в продакшн
    const CHAT_ID = 899304566;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          // parse_mode: "HTML", // можно вернуть позже
        }),
      }
    );

    if (!telegramResponse.ok) {
      const errText = await telegramResponse.text();
      console.error("❌ Telegram API error:", errText);
      return new Response(
        JSON.stringify({ success: false, error: "Telegram API error" }),
        { status: 500 }
      );
    }

    const telegramData = await telegramResponse.json();
    if (!telegramData.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Telegram API error: ${telegramData.description}`,
        }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error("❌ Server error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Server error" }),
      { status: 500 }
    );
  }
};
