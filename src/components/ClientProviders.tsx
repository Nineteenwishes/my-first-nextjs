'use client';

import dynamic from 'next/dynamic';

// Lazy load ChatWidget to improve initial page load performance
const ChatWidget = dynamic(() => import('@/components/ChatWidget'), {
    ssr: false,
    loading: () => null,
});

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <ChatWidget />
        </>
    );
}
