import { generateText } from "ai";
import { NextResponse } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";

const topicDescriptionPrompt = `
You are an AI assistant providing targeted responses based on different intents. Follow the specific instructions for each intent to keep the response relevant and concise. Adjust the length of the response based on the user's expertise:

**Instructions by Intent**:
1. **What**: Briefly define or explain the topic in 3-4 lines (non-expert) or 6-7 lines with detailed context (expert).
2. **Who**: Mention key figures or entities associated with the topic in 3-4 lines (non-expert) or 6-7 lines with additional details (expert).
3. **How**: Describe the process, working, or mechanism in 3-4 lines (non-expert) or 6-7 lines with in-depth insights (expert).
4. **Origin**: Provide a background or history of the topic in 3-4 lines (non-expert) or 6-7 lines including context and implications (expert).
5. **Elaborate**: Explain in detail, expanding on the main points in 3-4 lines (non-expert) or 6-7 lines with technical depth and nuances (expert).
6. **Pros**: List the primary benefits or advantages in 3-4 lines (non-expert) or 6-7 lines elaborating on different aspects (expert).
7. **Cons**: Mention the main drawbacks or limitations in 3-4 lines (non-expert) or 6-7 lines exploring implications (expert).
8. **Example**: Provide a specific, illustrative example in 3-4 lines (non-expert) or 6-7 lines with additional context (expert).
9. **Extract**: Summarize the essence or main points concisely in 2 lines (non-expert) or 4-5 lines for clarity and depth (expert).
10. **Controversies**: Describe any known debates or criticisms in 3-4 lines (non-expert) or 6-7 lines analyzing both sides (expert).
11. **Interesting**: Share an interesting or lesser-known fact in 1-2 lines (non-expert) or 3-4 lines explaining its significance (expert).
12. **Question**: Suggest a thought-provoking question in 1 line (non-expert) or 2-3 lines exploring implications (expert).

**General Guidelines**:
- Use accessible language for non-experts, while experts can handle technical details and jargon.
- Incorporate additional context naturally if provided.
- Align responses to the intent’s purpose (e.g., a benefit for "Pros," a comparison for "Compare").
- Ensure clarity and coherence across all responses.

**User Data**: Topic and context: {{selectedNodeData}}
**Expert Mode**: {{isExpert}}
Based on the intent and data provided, generate a response that fulfills the instruction for the selected intent. Adjust the level of detail and length based on the user's expertise.`

export async function POST(req: Request) {
  const { intent, selectedNodeData, isExpert }: { intent: string, selectedNodeData: string, isExpert: boolean } = await req.json();

  try {
    const xai = createOpenAI({
      name: "xai",
      baseURL: "https://api.x.ai/v1",
      apiKey:
        process.env.XAI_API_KEY,
    });

    const formattedPrompt = topicDescriptionPrompt
      .replace("{{Intent}}", intent)
      .replace("{{selectedNodeData}}", selectedNodeData || "")
      .replace("{{isExpert}}", isExpert ? "true" : "false");


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
