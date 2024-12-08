import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";

const systemPrompt = `
You will receive information related to a particular subject or topic in the form of a paragraph or a keyword, referred to as "subjectdata", along with an intent: "Related Concept", "Parent Concept", "Similar Concept", or "Sub Concept". Based on the intent:

1. **Related Concept**: Identify and suggest concepts that are directly connected or associated with "subjectdata" in its context.
2. **Parent Concept**: Determine broader or overarching concepts that encompass "subjectdata" as a subset or specific example.
3. **Similar Concept**: Suggest concepts that are analogous, comparable, or share similar characteristics with "subjectdata".
4. **Sub Concept**: Identify more specific or granular concepts that fall under "subjectdata".

Respond with concise and relevant suggestions tailored to the intent provided.
`;



export async function POST(req: Request){
   try {
     const { subjectdata, intent } = await req.json();
     const xai = createOpenAI({
         name: "xai",
         baseURL: "https://api.x.ai/v1",
         apiKey:
        process.env.XAI_API_KEY,
     })
     const {object: data} = await generateObject({
         model: xai("grok-beta"),
         output: "array",
         schema: z.object({
             concept: z.string(),
         }),
         prompt: subjectdata + intent,
         system: systemPrompt
     })
     return NextResponse.json({intent, data});
   } catch (error) {
        console.error("Error in GROK API call:", error);
        return NextResponse.json({error: error}, {status: 500});
   }

}