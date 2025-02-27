import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function getGeminiResponse(query: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: query }]
        },
      ],
    });
    const textResponse = response.response.text();
    console.log(textResponse);
    return textResponse;
  } catch (error) {
    console.error("Error generating content:", error);
  }
}
