export const config = {
  runtime: "edge",
};
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "只支持 POST 请求" });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "缺少 prompt" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.openai_api_key}`
      },
      body: JSON.stringify({
        model: "gpt-4-mini",
        input: prompt
      })
    });

    const data = await response.json();
    res.status(200).json(data);

  } catch (err) {
    console.error("调用 OpenAI API 错误:", err);
    res.status(500).json({ error: "调用 OpenAI API 出错" });
  }
}
