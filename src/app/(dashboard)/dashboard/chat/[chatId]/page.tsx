import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {notFound} from "next/navigation";
import {db} from "@/lib/db"
import {fetchRedis} from "@/helpers/redis";
import Image from "next/image";
import {validateMessagesArray} from "@/lib/validations/message";

interface PageProps {
    params: {
        chatId: string
    }
}

async function getChatMessages(chatId: string) {
    try {
        const result: string[] = await fetchRedis('zrange', `chat:${chatId}:messages`, 0, -1)
        const dbMessages = result.map(message => JSON.parse(message) as Message)
        const reverseDbMessages = dbMessages.reverse()
        return validateMessagesArray.parse(reverseDbMessages)
    } catch (e) {
        notFound()
    }
}

const Page = async ({params}: PageProps) => {
    const {chatId} = params
    const session = await getServerSession(authOptions)
    if (!session) return notFound()

    const {user} = session

    const [userId1, userId2] = chatId.split("--")
    if (user.id !== userId1 && user.id !== userId2) {
        return notFound()
    }

    const charPartnerId = user.id === userId1 ? userId2 : userId1
    const chatPartner = (await db.get(`user:${charPartnerId}`)) as User
    const initialMessages = await getChatMessages(chatId)

    return (
        <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem )]'>
            <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
                <div className='relative flex items-center space-x-4'>
                    <div className="relative">
                        <div className='relative w-12sr sm:w-12 h-12 sm:12'>
                            <Image
                                fill
                                referrerPolicy='no-referrer'
                                src={chatPartner.image}
                                alt='user image'
                                className="rounded-full"
                            />
                        </div>
                    </div>
                    <div className='flex flex-col leading-tigh'>
                        <div className='text-xl flex -items-center'>
                            <span className='text-gray-700 mr-3 font-semibold'>{chatPartner.name}</span>
                        </div>
                        <span className='text-sm text-gray-600'>{chatPartner.email}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page