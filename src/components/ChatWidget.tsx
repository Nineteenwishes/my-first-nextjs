'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const botReplies = [
    "Thanks for reaching out! I'm here to help.",
    "That's a great question! Let me think about that.",
    "I appreciate your interest in my portfolio!",
    "Feel free to ask me anything about my projects.",
    "I'd love to discuss this further. What specific details are you interested in?",
    "That's interesting! Tell me more.",
    "I'm currently available for new opportunities. Would you like to know more?",
    "Check out my GitHub for more projects!",
    "I specialize in full-stack development with modern technologies.",
    "Thanks! I put a lot of effort into building quality applications."
];

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Audio: context & fungsi notif hp
    const audioCtxRef = useRef<AudioContext | null>(null);

    const ensureAudioContext = async () => {
        if (!audioCtxRef.current) {
            const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
            audioCtxRef.current = new AC();
        }
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
            await audioCtxRef.current.resume();
        }
    };

    const playMobileNotif = async () => {
        await ensureAudioContext();
        const ctx = audioCtxRef.current!;
        const beep = (freq: number, start: number, duration: number, peak: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(0.0001, start);
            gain.gain.exponentialRampToValueAtTime(peak, start + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
            osc.connect(gain).connect(ctx.destination);
            osc.start(start);
            osc.stop(start + duration + 0.02);
        };

        const now = ctx.currentTime;
        // Nada 1 (lebih rendah, pendek) lalu Nada 2 (sedikit lebih tinggi)
        beep(1200, now, 0.12, 0.12);
        beep(1600, now + 0.18, 0.14, 0.12);
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Cleanup audio context saat unmount
    useEffect(() => {
        return () => {
            audioCtxRef.current?.close();
            audioCtxRef.current = null;
        };
    }, []);

    // Load chat history from localStorage on mount
    useEffect(() => {
        if (!isMounted) return;

        const savedMessages = localStorage.getItem('chatHistory');
        if (savedMessages) {
            try {
                const parsed = JSON.parse(savedMessages);
                setMessages(parsed.map((msg: Message) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                })));
            } catch (e) {
                console.error("Failed to parse chat history", e);
            }
        } else {
            // Welcome message
            setMessages([{
                id: 1,
                text: "Hello! 👋 I'm the portfolio assistant. How can I help you today?",
                sender: 'bot',
                timestamp: new Date()
            }]);
        }
    }, [isMounted]);

    // Save messages to localStorage
    useEffect(() => {
        if (!isMounted) return;
        if (messages.length > 0) {
            localStorage.setItem('chatHistory', JSON.stringify(messages));
        }
    }, [messages, isMounted]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping, isOpen]);

    const handleSendMessage = () => {
        if (inputValue.trim() === '') return;

        // Add user message
        const userMessage: Message = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        // Show typing indicator
        setIsTyping(true);

        // Simulate bot response delay
        setTimeout(() => {
            setIsTyping(false);
            const botMessage: Message = {
                id: Date.now() + 1,
                text: botReplies[Math.floor(Math.random() * botReplies.length)],
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);

            // Notif hp: bunyi hanya saat balasan dari bot
            playMobileNotif();
        }, 1000 + Math.random() * 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }).format(date);
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    if (!isMounted) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Chat Window */}
            <div
                className={`absolute bottom-16 right-0 w-[280px] sm:w-[300px] h-[400px] sm:h-[450px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl transition-all duration-300 ease-in-out origin-bottom-right flex flex-col border border-gray-200 dark:border-zinc-800 ${isOpen
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
                    }`}
            >
                {/* Header */}
                <div className="bg-black dark:bg-zinc-800 rounded-t-2xl p-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl backdrop-blur-sm">
                            🤖
                        </div>
                        <div>
                            <h3 className="text-white font-semibold text-lg leading-tight">Akbar Maulana Bot</h3>
                            <p className="text-gray-400 text-xs flex items-center gap-1">
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                Online
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={toggleChat}
                        className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors"
                        aria-label="Close chat"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-zinc-950/50 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-zinc-700">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up mb-4`}
                        >
                            {message.sender === 'bot' && (
                                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-2 text-lg shrink-0">
                                    🤖
                                </div>
                            )}
                            <div className={`max-w-[75%] flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`px-4 py-2.5 shadow-sm break-words ${message.sender === 'user'
                                        ? 'bg-black dark:bg-white text-white dark:text-black rounded-2xl rounded-tr-sm'
                                        : 'bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 rounded-2xl rounded-tl-sm border border-gray-100 dark:border-zinc-700'
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                                </div>
                                <span className={`text-[10px] text-gray-400 mt-1 px-1`}>
                                    {formatTime(message.timestamp)}
                                </span>
                            </div>
                            {message.sender === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center ml-2 text-lg shrink-0">
                                    👤
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex justify-start animate-fade-in-up">
                            <div className="bg-white dark:bg-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100 dark:border-zinc-700 flex items-center gap-3">
                                <div className="flex space-x-1.5">
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                </div>
                                <span className="text-xs text-gray-400">Bot is typing...</span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-zinc-900 rounded-b-2xl border-t border-gray-100 dark:border-zinc-800 shrink-0">
                    <div className="flex items-center space-x-2 bg-gray-100 dark:bg-zinc-800 rounded-full px-2 py-2 focus-within:ring-2 focus-within:ring-black/5 dark:focus-within:ring-white/10 focus-within:bg-white dark:focus-within:bg-zinc-900 transition-all border border-transparent focus-within:border-black/50 dark:focus-within:border-white/50">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className="flex-1 bg-transparent text-gray-800 dark:text-gray-100 px-3 py-1 focus:outline-none text-sm placeholder-gray-500"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim()}
                            className="p-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-sm"
                            aria-label="Send message"
                        >
                            <svg className="w-4 h-4 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating Button */}
            <button
                onClick={toggleChat}
                className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 z-50 ${isOpen
                    ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white rotate-0'
                    : 'bg-black dark:bg-white text-white dark:text-black hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white border border-transparent hover:border-black/10 dark:hover:border-white/10 rotate-0'
                    }`}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                <div className="relative w-8 h-8 flex items-center justify-center overflow-hidden">
                    <svg
                        className={`w-8 h-8 absolute transition-all duration-300 ${isOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <svg
                        className={`w-6 h-6 absolute transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </button>
        </div>
    );
}
