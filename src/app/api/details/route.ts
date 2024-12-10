import { generateText } from "ai";
import { NextResponse } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";

const llmPromptTemplate = `
You are an expert in simplifying and explaining concepts. Based on the following parameters, provide a tailored response with length and depth adjusted based on expertise:

1. **Intent**: [INTENT]  
   *(This indicates the type of explanation needed, such as explaining a concept, its significance, or its implications.)*

2. **Instruction**: [INSTRUCTION]  
   *(This specifies the style or perspective for the explanation, such as "Like I am 5 years old," "Using a story," or "From first principles.")*

3. **Subject**: [SUBJECT]  
   *(This is the topic or concept to be explained.)*

### Task:
Combine the intent, instruction, and subject to generate a coherent and engaging explanation that follows these guidelines:
- For **non-expert users**, keep the explanation concise and approachable within 6-8 sentences. Avoid unnecessary jargon and focus on clarity.
- For **expert users**, provide detailed insights, nuanced explanations, and additional context within 12-15 sentences.
- Tailor the language and depth to suit the **instruction** provided.
- Address the **intent** fully by focusing on the corresponding aspect (e.g., concept explanation, significance, or implications).
- Ensure the explanation is clear, accurate, and actionable.

### Parameters for This Request:
- **Intent**: [Insert Intent Here]
- **Instruction**: [Insert Instruction Here]
- **Subject**: [Insert Subject Here]
- **Expert Mode**: [True/False]
`;

export async function POST(req: Request) {
    const { intent, instruction ,selectedNodeData, isExpert }: { intent: string, instruction: string, selectedNodeData: string, isExpert: boolean } = await req.json();
  
    try {
      const xai = createOpenAI({
        name: "xai",
        baseURL: "https://api.x.ai/v1",
        apiKey:
          process.env.XAI_API_KEY,
      });
  
      const formattedPrompt = llmPromptTemplate
        .replace("[Insert Intent Here]", intent)
        .replace("[Insert Instruction Here]", instruction)
        .replace("[Insert Subject Here]", selectedNodeData || "")
        .replace("[True/False]", isExpert ? "true" : "false");
  
      const { text } = await generateText({
        model: xai("grok-beta"),
        prompt: intent + " " + instruction + " " + selectedNodeData,
        system: formattedPrompt,
      });
      return NextResponse.json({ information: text });
    } catch (error) {
      console.error("Error in GROK API call:", error);
      return NextResponse.json({ error: error }, { status: 500 });
    }
  }
  