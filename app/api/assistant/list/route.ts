import OpenAI from "openai";

export async function GET() {
  const openai = new OpenAI();

  try {
    const response = await openai.beta.assistants.list({
      order: "desc",
      limit: 10,
    });
    const assistants = response.data;
    console.log(assistants);
    return Response.json({ assistants: assistants }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: `Error in list assistant controller = ${error}` },
      { status: 500 }
    );
  }
}
