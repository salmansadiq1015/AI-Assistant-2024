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
    const deletedFile = await openai.beta.assistants.files.del(
      assistantId,
      fileId
    );
    console.log(deletedFile);
    return Response.json(deletedFile, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: `Error in create assistant file = ${error}` },
      { status: 500 }
    );
  }
}
