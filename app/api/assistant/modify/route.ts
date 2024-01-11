import { NextRequest } from "next/server";
import OpenAI from "openai";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const assistantId = searchParams.get("assistantId");
  const fileId = searchParams.get("fileId");

  if (!assistantId) {
    return Response.json({ error: "No assistantId provided" }, { status: 400 });
  }

  if (!fileId) {
    return Response.json({ error: "No fileId provided" }, { status: 400 });
  }
  const openai = new OpenAI();
  try {
    const myUpdatedAssistant = await openai.beta.assistants.update(
      assistantId,
      {
        instructions:
          "You are an HR bot, and you have access to files to answer employee questions about company policies. Always response with info from either of the files.",
        name: "HR Helper",
        tools: [{ type: "retrieval" }],
        model: "gpt-4-1106-preview",
        file_ids: [fileId],
      }
    );

    console.log(myUpdatedAssistant);

    return Response.json(
      { assistant: myUpdatedAssistant, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: `Error in modify assistant controller = ${error}` },
      { status: 500 }
    );
  }
}
