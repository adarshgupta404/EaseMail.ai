import { db } from "./server/db";

const result = await db.user.create({
    data:{
        emailAddress:"adarsh@gmail.com",
        firstName: "Adarsh",
        lastName:"Gupta",
        imageUrl:"https://avatar.iran.liara.run/public/16"
    }
})

console.log(result)