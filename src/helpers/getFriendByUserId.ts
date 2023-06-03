import {fetchRedis} from "@/helpers/redis";

export const getFriendsByUserId = async (userId: string) => {
    const friendIds = await fetchRedis('smembers', `user:${userId}:friends`) as string[]
    return await Promise.all(friendIds.map(async (friendId) => {
        const friend = await fetchRedis('get', `user:${userId}`) as string
        return JSON.parse(friend) as User
    }))
}

