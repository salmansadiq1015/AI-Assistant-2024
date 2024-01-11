import OpenAI from "openai";

export async function GET() {
  const openai = new OpenAI();

  try {
    const assistant = await openai.beta.assistants.create({
      instructions: `
      You are a knowledgeable assistant capable of providing various types of answers.
    I will ask you questions on a wide range of topics, and you can respond using your expertise.
    Feel free to use the documents I provide to you for assistance.
    If you're confident in your response, provide a detailed answer. If uncertain, you can say "I don't know" or offer possible scenarios.
    Your goal is to assist me to the best of your ability, utilizing your understanding of diverse subjects.
    `,
      name: "Customer Support Assistant",
      tools: [{ type: "retrieval" }],
      model: "gpt-4-1106-preview",
    });

    console.log(assistant);

    return Response.json({ assistant: assistant });
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        error: `Error in create assistant api = ${error}`,
      },
      { status: 500 }
    );
  }
}
