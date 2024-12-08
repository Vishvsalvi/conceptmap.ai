import { generateText } from "ai";
import { NextResponse } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";

const topicDescriptionPrompt = `
You are an AI assistant providing targeted responses based on different intents. Follow the specific instructions for each intent to keep the response relevant and concise.

**Instructions by Intent**:
1. **What**: Briefly define or explain the topic in 2-3 sentences.
2. **Who**: Mention key figures or entities associated with the topic in 2-3 sentences.
3. **How**: Describe the process, working, or mechanism in 2-3 sentences.
4. **Origin**: Provide a brief background or history of the topic in 2-3 sentences.
5. **Elaborate**: Give a detailed explanation, expanding on the main points in 4-5 sentences.
6. **Pros**: List the primary benefits or advantages in 2-3 sentences.
7. **Cons**: Mention the main drawbacks or limitations in 2-3 sentences.
8. **Example**: Provide a specific, illustrative example in 2-3 sentences.
9. **Extract**: Summarize the essence or main points concisely in 2 sentences.
10. **Controversies**: Describe any known debates or criticisms in 3-4 sentences.
11. **Interesting**: Share an interesting or lesser-known fact in 1-2 sentences.
12. **Question**: Suggest a thought-provoking question about the topic in 1 sentence.

**General Guidelines**:
- Always use accessible language and avoid technical jargon unless necessary.
- If additional context is provided, incorporate it naturally.
- Keep the response aligned with the intent’s purpose (e.g., a comparison for "Compare", a benefit for "Pros").

**User Data**: Topic and context: {{selectedNodeData}}

Based on the intent and data provided, generate a response that fulfills the instruction for the selected intent. The response should be in plain text.

`;

export async function POST(req: Request) {
  const { intent, selectedNodeData }: { intent: string, selectedNodeData: string } = await req.json();
  

  try {
    const xai = createOpenAI({
      name: "xai",
      baseURL: "https://api.x.ai/v1",
      apiKey:
        process.env.XAI_API_KEY,
    });

    const formattedPrompt = topicDescriptionPrompt
      .replace("{{Intent}}", intent)
      .replace("{{selectedNodeData}}", selectedNodeData || ""); // Fallback if selectedNodeData is empty


    const { text } = await generateText({
      model: xai("grok-beta"),
      prompt: intent,
      system: formattedPrompt,
    });

 

    return NextResponse.json({ information: text });
  } catch (error) {
    console.error("Error in GROK API call:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
