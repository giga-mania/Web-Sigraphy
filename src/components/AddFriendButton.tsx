'use client'

import {FC, useState} from 'react';
import axios, {AxiosError} from "axios";
import {z} from "zod"
import Button from "@/components/ui/Button";
import {validateAddFriendInputSchema} from "@/lib/validations/addFriend";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

interface AddFriendButtonProps {}

type FormData = z.infer<typeof validateAddFriendInputSchema>

const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
    const [showSuccess, setShowSuccess] = useState(false)
    const {register, handleSubmit, setError, formState: {errors}} = useForm<FormData>({
        resolver: zodResolver(validateAddFriendInputSchema)
    })

    const addFriend = async (email: string) => {
        try {
            const validatedEmail = validateAddFriendInputSchema.parse({email})

            await axios.post("/api/friends/add", {email: validatedEmail})

            setShowSuccess(true)
        } catch (e) {
            if (e instanceof z.ZodError) {
                setError("email", {message: e.message})
                return
            }

            if(e instanceof AxiosError) {
                setError("email", {message: e.response?.data})
                return
            }

            setError("email", {message: "Something went wrong!"})
        }
    }


    const onSubmit = (data: FormData) => {
        addFriend(data.email)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Add fried by Email
            </label>
            <div className="mt-2 flex gap-4">
                <input type="text"
                       {...register("email", {required:true})}
                       placeholder="example@email.com"
                       className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadom-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <Button>Add</Button>
            </div>
            <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
            {showSuccess && <p className="mt-1 text-sm text-green-600">Friend request has been sent!</p>}
        </form>
    );
}

export default AddFriendButton