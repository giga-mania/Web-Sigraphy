import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {fetchRedis} from "@/helpers/redis";
import {validateAddFriendInputSchema} from "@/lib/validations/addFriend";
import {db} from "@/lib/db"
import {ZodError} from "zod";


export async function POST(req: Request) {
    try {
        const body = await req.json()
        const {email: emailToAdd} = validateAddFriendInputSchema.parse(body.email)

        // Check if userToAdd even exists
        const idToAdd = await fetchRedis('get', `user:email:${emailToAdd}`) as string | null
        if(!idToAdd) return new Response('No user registered with given email', {status: 400})

        // Get who is making request
        const session = await getServerSession(authOptions)
        if(!session) return new Response("Unauthorized", {status: 401})

        // Check is adds himself/herself
        if(idToAdd === session.user.id) return new Response("You can't be added as friend", {status: 400})

        // Check if already added (friend request is already sent)
        const isAlreadyAdded = await fetchRedis('sismember', `user:${idToAdd}:incoming_friend_requests`, session.user.id) as 1 | 0
        if(isAlreadyAdded) return  new Response('Friend request is already sent', {status: 400})

        // Check if already a friend
        const isAlreadyFriend = await fetchRedis('sismember', `user:${session.user.id}:friends`, idToAdd) as 1 | 0
        if(isAlreadyFriend) return  new Response('User is already in friend list', {status: 400})

        // Validate: send friend request
        await db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id)

        return new Response("OK", {status: 200})
    } catch (e) {
        if(e instanceof ZodError) {
            return new Response('Invalid request payload', {status: 422})
        }

        return new Response('Invalid request', {status: 400})
    }
}

