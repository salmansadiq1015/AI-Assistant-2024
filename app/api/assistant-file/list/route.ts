import { NextRequest } from "next/server";
import OpenAI from "openai";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const assistantId = searchParams.get("assistantId");

  if (!assistantId) {
    return Response.json({ error: "No id provided" }, { status: 400 });
  }

  const openai = new OpenAI();
  try {
    const assistantFiles = await openai.beta.assistants.files.list(assistantId);

    console.log("Assistant Files:", assistantFiles);
    return Response.json({ assistantFiles: assistantFiles }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: `Error in create assistant file = ${error}` },
      { status: 500 }
    );
  }
}
