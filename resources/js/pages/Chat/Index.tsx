import AppLayout from '@/layouts/app-layout';
import { User } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Index({ users }: { users: User[] }) {
    return (
        <AppLayout>
            <Head title="Chat" />
            <h1 className={'p-4 text-2xl font-bold'}>Real Time Chat</h1>
            <div className={'flex'}>
                <div className={'m-2 rounded w-full'}>
                    {users.map((user) => (
                        <div key={user.id} className={'p-2 border-b'}>
                            <Link href={`/chat/${user.id}`}>
                                <p className={'text-xl font-bold'}>{user.name}</p>
                                <p className={'text-muted-foreground'}>Chat with {user.name}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
