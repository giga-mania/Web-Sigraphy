import {z} from "zod"

export const validateAddFriendInputSchema = z.object({
    email: z.string().email()
})