import { InscriptionCommand, InscriptionCommandValidation } from "@/utils";
import axios from "axios";

export const dynamic = "force-dynamic";

const notion = (data: InscriptionCommand) => {
  try {
    return axios.post(
      "https://api.notion.com/v1/pages",
      {
        parent: {
          type: "database_id",
          database_id: process.env.NOTION_DB_INSCRIPTIONS,
        },
        properties: {
          Email: {
            type: "title",
            title: [{ type: "text", text: { content: data.email } }],
          },
          "Situation professionnelle": {
            type: "rich_text",
            rich_text: [{ text: { content: data.user || "NC" } }],
          },
          "Visite au Forum": {
            type: "rich_text",
            rich_text: [
              { text: { content: data.objectives?.join(", ") || "NC" } },
            ],
          },
          Intérêts: {
            type: "rich_text",
            rich_text: [
              { text: { content: data.subjects?.join(", ") || "NC" } },
            ],
          },
          "Expérience professionnelle": {
            type: "rich_text",
            rich_text: [{ text: { content: data.experience || "NC" } }],
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
        },
      },
    );
  } catch (e) {
    console.error("Erreur notion -----------", e);
  }
};

const brevo = async (data: InscriptionCommand) => {
  try {
    return axios
      .post(
        "https://api.brevo.com/v3/contacts",
        {
          email: data.email,
          listIds: [Number(process.env.BREVO_LIST_ID)],
          updateEnabled: false,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "api-key": process.env.BREVO_API_KEY,
          },
        },
      )
      .catch(() => {
        return axios.post(
          `https://api.brevo.com/v3/contacts/lists/${process.env.BREVO_LIST_ID}/contacts/add`,
          {
            emails: [data.email],
          },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "api-key": process.env.BREVO_API_KEY,
            },
          },
        );
      });
  } catch (e) {
    console.error("Erreur brevo -----------", e);
  }
};

export async function POST(request: Request) {
  const body = await request.json();
  const inputs = InscriptionCommandValidation.safeParse(body);
  if (!inputs.success) {
    return new Response(JSON.stringify(inputs.error), {
      status: 400,
    });
  }

  await notion(inputs.data);
  await brevo(inputs.data);

  return Response.json({ success: true });
}
