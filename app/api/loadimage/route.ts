import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");
  // verify if the request comes from here and not from another domain
  // get the image from the url
  if (!url || typeof url !== "string") {
    return new Response("Invalid URL", { status: 400 });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return new Response(buffer, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    return new Response("Failed to fetch image", { status: 500 });
  }
}
