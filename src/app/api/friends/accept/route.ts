import {z} from "zod"
import {db} from "@/lib/db"
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {fetchRedis} from "@/helpers/redis";

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const {id: idToAdd} = z.object({id: z.string()}).parse(body)
        const session = await getServerSession(authOptions)

        if (!session) return new Response("Unauthorized", {status: 401})

        // Check whether user are already friend
        const isAlreadyFriend = await fetchRedis("sismember", `user:${session.user.id}:friends`, idToAdd)
        if (isAlreadyFriend) return new Response("Already Friends", {status: 400})

        //
        const hasFriendRequest = await fetchRedis("sismember", `user:${session.user.id}:incoming_friend_requests`, idToAdd)
        if (!hasFriendRequest) return new Response("No friend Request", {status: 400})

        await db.sadd(`user:${session.user.id}:friends`, idToAdd)
        await db.sadd(`user:${idToAdd}:friend`, session.user.id)
        // await db.srem(`user:${idToAdd}:outbound_incoming_friend_requests`, session.user.id)

        await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd)

        return new Response("User Added", {status: 200})
    } catch (e) {
        if(e instanceof z.ZodError) {
            return new Response("Invalid request payload", {status: 422})
        }

        return new Response("Invalid Request", {status: 400})
    }
}