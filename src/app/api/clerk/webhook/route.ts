//api/clerk/webhook

import { db } from "@/server/db";

export const POST = async (req: Request) => {
  const { data } = await req.json();
  console.log("clerk webhook recieved", data);
  const emailAddress = data.email_addresses[0].email_address;
  const firstName = data.first_name;
  const lastName = data.last_name;
  const imageUrl = data.image_url;
  const id = data.id;
  await db.user.create({
    data: {
      id: id,
      emailAddress,
      firstName,
      lastName,
      imageUrl,
    },
  });
  return new Response("Webhook Recieved!", { status: 200 });
};
