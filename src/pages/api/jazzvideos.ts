import type { NextApiRequest, NextApiResponse } from "next"
import { Client } from "@notionhq/client"
// import 'dotenv/config'; 


const notion = new Client({ auth: process.env.NOTION_JAZZ_TOKEN })


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    

    const databaseId = process.env.NOTION_JAZZ_DATABASE_ID!;
    const response = await notion.databases.query({ database_id: databaseId })
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const videos = response.results.map((page: any) => {
      const props = page.properties
      

      // console.log("👉 Propriétés de la page Notion :", props)


    //   return {
    //     id: page.id,
    //     title: props["Title"]?.rich_text[0]?.plain_text || "Sans titre",
    //     date: props["Date"]?.date?.start || "",
    //     videoUrl: props["Video Link"]?.title?.[0]?.plain_text || "",
    //     notes: props["Important Steps"]?.rich_text[0]?.plain_text || "",
    //   }
    // })
      return {
        id: page.id,
        title: props["Title"]?.rich_text[0]?.plain_text ?? "Sans titre",
        date: props["Date"]?.date?.start ?? "",
        videoUrl: props["Video Link"]?.title?.[0]?.plain_text ?? "",
        notes: props["Important Steps"]?.rich_text[0]?.plain_text ?? "",
      }
    })
    
    res.status(200).json(videos)
  } catch (err) {
    console.error("Erreur Notion :", err)
    // console.log("TOKEN vaut :", process.env.NOTION_TOKEN);

    res.status(500).json([]) //renvoie un tableau vide en cas d'erreur
  }
}
