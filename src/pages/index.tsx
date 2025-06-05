import React, { useState } from 'react';
import ChatInput from '../components/ChatInput';
import ChatMessages from '../components/ChatMessages';

type Message = {
    id: number;
    text: string;
    sender: 'user' | 'bot';
};

const Home = () => {
    const [messages, setMessages] = useState<Message[]>([]);

    const handleSendMessage = async (message: string) => {
    const userMessage: Message = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        text: message,
        sender: 'user',
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
    });

    const data = await response.json();

    // Simula atraso de 700ms antes de mostrar a resposta do bot
    setTimeout(() => {
        const botMessage: Message = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            text: data.reply,
            sender: 'bot',
        };
        setMessages((prev) => [...prev, botMessage]);
    }, 700);
};

    return (
        <div>
            <h1>Bot Cívico</h1>
            <ChatMessages messages={messages} />
            <ChatInput onSend={handleSendMessage} />
        </div>
    );
};

export default Home;