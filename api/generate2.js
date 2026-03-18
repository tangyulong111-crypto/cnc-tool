export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const body = await req.json().catch(() => null);

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "只支持POST" }), { status: 405 });
  }

  if (!body || !body.prompt) {
    return new Response(JSON.stringify({ error: "缺少prompt" }), { status: 400 });
  }

  try {
    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "你是CNC工程师，生成规范G代码" },
          { role: "user", content: body.prompt },
        ],
      }),
    });

    const data = await aiRes.json();

    return new Response(JSON.stringify(data), { status: 200 });

  } catch (e) {
    return new Response(JSON.stringify({ error: "服务器错误" }), { status: 500 });
  }
}
