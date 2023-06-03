import {z} from "zod"

export const validateMessageSchema = z.object({
    id: z.string(),
    senderId: z.string(),
    text: z.string(),
    timestamp: z.number()
})

export const validateMessagesArray = z.array(validateMessageSchema)

export type Message = z.infer<typeof validateMessageSchema>