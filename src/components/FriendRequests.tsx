'use client'

import {FC, useState} from 'react';
import {Check, UserPlus, X} from "lucide-react";
import axios from "axios";
import {useRouter} from "next/navigation";

interface FriendRequestsProps {
    incomingFriendRequests: IncomingFriendRequest[],
    sessionId: string
}


const FriendRequests: FC<FriendRequestsProps> = ({incomingFriendRequests}) => {
    const router = useRouter()
    const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(incomingFriendRequests)


    const acceptFriendRequest = async (senderId: string) => {
        await axios.post('/api/friends/accept', {id: senderId})
        setFriendRequests(prev => prev.filter((req) => req.senderId !== senderId))
        router.refresh()
    }

    const denyFriendRequest = async (senderId: string) => {
        await axios.post('/api/friends/deny', {id: senderId})
        setFriendRequests(prev => prev.filter((req) => req.senderId !== senderId))
        router.refresh()
    }

    return (
        <>
            {friendRequests.length === 0 ? <p className="text-sm text-zinc-500">Nothing to show...</p> : (
                friendRequests.map((request) => (
                    <div key={request.senderId} className="flex gap-4 items-center">
                        <UserPlus className="text-black"/>
                        <p className="font-medium text-lg">{request.senderEmail}</p>
                        <button
                            onClick={() => acceptFriendRequest(request.senderId)}
                            className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"
                            aria-label="accept friend">
                            <Check className="font-semibold text-white w-3/4 h-3/4"/>
                        </button>

                        <button
                            onClick={() => denyFriendRequest(request.senderId)}
                            className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
                            aria-label="deny friend">
                            <X className="font-semibold text-white w-3/4 h-3/4"/>
                        </button>
                    </div>
                ))
            )}
        </>
    );
}

export default FriendRequests