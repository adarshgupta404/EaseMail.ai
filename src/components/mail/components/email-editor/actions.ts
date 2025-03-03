'use server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createStreamableValue } from 'ai/rsc';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateEmail(context: string, prompt: string) {
    console.log("context", context);
    const stream = createStreamableValue('');

    (async () => {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const responseStream = await model.generateContentStream({
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `
                            You are an AI email assistant embedded in an email client app. Your purpose is to help the user compose emails by providing suggestions and relevant information based on the context of their previous emails.
                            
                            THE TIME NOW IS ${new Date().toLocaleString()}
                            
                            START CONTEXT BLOCK
                            ${context}
                            END OF CONTEXT BLOCK
                            
                            USER PROMPT:
                            ${prompt}
                            
                            When responding, please keep in mind:
                            - Be helpful, clever, and articulate. 
                            - Rely on the provided email context to inform your response.
                            - If the context does not contain enough information to fully address the prompt, politely give a draft response.
                            - Avoid apologizing for previous responses. Instead, indicate that you have updated your knowledge based on new information.
                            - Do not invent or speculate about anything that is not directly supported by the email context.
                            - Keep your response focused and relevant to the user's prompt.
                            - Directly output the email, no need to say 'Here is your email' or anything like that.
                            - No need to output subject.
                            `,
                        },
                    ],
                },
            ],
        });

        for await (const chunk of responseStream.stream) {
            stream.update(chunk.text());
        }

        stream.done();
    })();

    return { output: stream.value };
}

export async function generate(input: string) {
    console.log("input", input);
    const stream = createStreamableValue('');

    (async () => {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const responseStream = await model.generateContentStream({
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `
                            ALWAYS RESPOND IN PLAIN TEXT, no HTML or markdown.
                            You are a helpful AI embedded in an email client app that is used to autocomplete sentences, similar to Google Gmail autocomplete.
                            The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
                            AI is always friendly, kind, and inspiring, and eager to provide vivid and thoughtful responses.
                            
                            I am writing a piece of text in a notion text editor app.
                            Help me complete my train of thought here: <input>${input}</input>
                            Keep the tone of the text consistent with the rest of the text.
                            Keep the response short and sweet. Act like a copilot, finish my sentence if needed, but don't generate a whole new paragraph.
                            Do not add fluff like "I'm here to help you" or "I'm a helpful AI."
                            
                            Example:
                            Dear Alice, I'm sorry to hear that you are feeling down.

                            Output: Unfortunately, I can't help you with that.

                            Your output is directly concatenated to the input, so do not add any new lines or formatting, just plain text.
                            `,
                        },
                    ],
                },
            ],
        });

        for await (const chunk of responseStream.stream) {
            stream.update(chunk.text());
        }

        stream.done();
    })();

    return { output: stream.value };
}
