import AppLayout from '@/layouts/app-layout';
import { User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

type Message = {
    id: number;
    sender_id: number;
    receiver_id: number;
    message: string;
    created_at: string;
};

type Props = {
    auth: { user: { id: number; name: string } };
    receiverId: number;
    users: User[];
};

export default function Show({ auth, receiverId, users }: Props) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState('');

    useEffect(() => {
        axios.get(`/messages?receiver_id=${receiverId}`).then((res) => {
            setMessages(res.data);
        });

        window.Echo.private(`chat.${auth.user.id}`).listen('MessageSent', (e: any) => {
            if (e.sender_id === receiverId) {
                setMessages((prev) => [...prev, e]);
            }
        });

        return () => {
            window.Echo.leave(`chat.${auth.user.id}`);
        };
    }, [auth.user.id, receiverId]);

    const sendMessage = () => {
        axios
            .post('/messages', {
                receiver_id: receiverId,
                message: text,
            })
            .then((res) => {
                setMessages((prev) => [...prev, res.data]);
                setText('');
            });
    };

    return (
        <AppLayout>
            <Head title={`${users.find((user) => user.id === receiverId)?.name} `}/>
            <div className="flex">
                <div className="bg-muted m-2 w-1/3 overflow-y-auto rounded">
                    {users.map((user) => (
                        <div key={user.id} className={`m-2 cursor-pointer rounded p-4 ${user.id === receiverId ? 'bg-blue-100' : 'bg-white'}`}>
                            <Link href={route('chat.show', user.id)} className={'text-xl font-bold'}>
                                <p>{user.name}</p>
                            </Link>
                        </div>
                    ))}
                </div>
                <div className="p-4">
                    <div className="mb-2 h-96 overflow-y-auto border p-2">
                        {messages.map((msg, i) => (
                            <div key={i} className={msg.sender_id === auth.user.id ? 'text-right' : 'text-left'}>
                                <p className="inline-block rounded bg-gray-200 p-2">{msg.message}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input type="text" className="w-full border p-2" value={text} onChange={(e) => setText(e.target.value)} />
                        <button className="bg-blue-500 px-4 text-white" onClick={sendMessage}>
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
