import { LoaderCircle } from 'lucide-react';

export default function Loading() {
    return (
        <main className="flex h-screen max-h-screen min-h-[600px] w-full flex-col items-center justify-center p-24">
            <LoaderCircle className="size-10 animate-spin" />
        </main>
    );
}
