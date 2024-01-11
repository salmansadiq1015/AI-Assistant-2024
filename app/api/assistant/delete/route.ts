import { NextRequest } from "next/server";
import OpenAI from "openai";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const assistantId = searchParams.get("assistantId");

  if (!assistantId) {
    return Response.json({ error: "No assistantId provided" }, { status: 400 });
  }
  const openai = new OpenAI();

  try {
    const response = await openai.beta.assistants.del(assistantId);
    console.log(response);

    return Response.json(response);
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: `Error in delete assistant = ${error}` },
      { status: 500 }
    );
  }
}
