import React, { useState } from 'react';
import { Bot } from 'lucide-react';
import ChatInput from '../components/ChatInput';
import ChatMessages from '../components/ChatMessages';

type Message = {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
};

const Home = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async (message: string) => {
        const userMessage: Message = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            text: message,
            sender: 'user',
            timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            const data = await response.json();
            
            const botMessage: Message = {
                id: Date.now() + Math.floor(Math.random() * 1000),
                text: data.reply,
                sender: 'bot',
                timestamp: new Date(),
            };
            
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: Date.now() + Math.floor(Math.random() * 1000),
                text: 'Desculpe, ocorreu um erro. Tente novamente mais tarde.',
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="container">
                {/* Header */}
                <div className="header">
                    <div className="header-content">
                        <div className="header-left">
                            <div className="bot-avatar">
                                <Bot size={20} />
                            </div>
                            <div className="header-info">
                                <h1 className="header-title">BOT - Cívico</h1>
                                <p className="header-subtitle">Assistente para questões cívicas</p>
                            </div>
                        </div>
                        <div className="status-indicator">
                            <div className="status-dot"></div>
                            <span className="status-text">Online</span>
                        </div>
                    </div>
                </div>

                {/* Chat Container */}
                <div className="chat-container">
                    <ChatMessages messages={messages} isLoading={isLoading} />
                    <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
};

export default Home;