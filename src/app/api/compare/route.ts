import { generateText } from "ai";
import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";

const comparePromptTemplate = `
You are an expert in analyzing and comparing concepts, ideas, or topics. Based on the following parameters, provide a comprehensive comparison:

1. **Nodes to Compare**: [NODES_DATA]
   *(This contains the data from multiple nodes that need to be compared)*

2. **Comparison Type**: [COMPARISON_TYPE]
   *(This specifies the type of comparison needed, such as "Similarities and differences", "Strengths and weaknesses", etc.)*

### Task:
Analyze the provided nodes and generate a structured comparison that follows these guidelines:

- **Comprehensive Analysis**: Compare all provided nodes systematically
- **Structured Format**: Use clear headings and bullet points for different aspects
- **Balanced View**: Present both similarities and differences objectively
- **Actionable Insights**: Provide meaningful conclusions and recommendations
- **Contextual Relevance**: Consider the type and content of each node when making comparisons

### Comparison Structure:
1. **Overview**: Brief summary of what is being compared
2. **Key Similarities**: Common aspects across nodes
3. **Key Differences**: Unique aspects of each node
4. **Strengths and Weaknesses**: If applicable to the comparison type
5. **Use Cases**: When to use one vs. another
6. **Recommendations**: Guidance on which option might be better in different scenarios

### Parameters for This Request:
- **Nodes Data**: [Insert Nodes Data Here]
- **Comparison Type**: [Insert Comparison Type Here]
- **Expert Mode**: [True/False]
`;

export async function POST(req: Request) {
    const { nodes, comparisonType, isExpert }: {
        nodes: Array<{id: string, type: string, data: any}>,
        comparisonType: string,
        isExpert: boolean
    } = await req.json();

    try {
        if (!nodes || nodes.length < 2) {
            return NextResponse.json({ error: "At least 2 nodes are required for comparison" }, { status: 400 });
        }

        // Format nodes data for the prompt
        const nodesData = nodes.map((node, index) => {
            const content = node.type === 'dataNode' ? node.data.description :
                           node.type === 'titleNode' ? node.data.label :
                           node.data.term || node.data.label;
            return `Node ${index + 1} (${node.type}): ${content}`;
        }).join('\n\n');

        const formattedPrompt = comparePromptTemplate
            .replace("[Insert Nodes Data Here]", nodesData)
            .replace("[Insert Comparison Type Here]", comparisonType)
            .replace("[True/False]", isExpert ? "true" : "false");

        const userPrompt = `Please compare the following ${nodes.length} items using a ${comparisonType} approach:\n\n${nodesData}`;

        const { text } = await generateText({
            model: google("gemini-2.0-flash"),
            prompt: userPrompt,
            system: formattedPrompt,
        });

        return NextResponse.json({ comparison: text });
    } catch (error) {
        console.error("Error in compare API call:", error);
        return NextResponse.json({ error: "Failed to generate comparison" }, { status: 500 });
    }
}
