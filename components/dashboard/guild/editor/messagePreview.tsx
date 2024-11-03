import { Welcomer } from "@/lib/discord/schema"

export default function MessagePreview({ msg }: { msg: Welcomer }) { 
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold">Preview</h1>
            <p className="text-gray-600">This is what your message will look like when sent.</p>
            <div className="mt-4">
                <p className="text-gray-600">Message:</p>
                <p className="text-lg">{msg.content}</p>
            </div>
        </div>
    )
}