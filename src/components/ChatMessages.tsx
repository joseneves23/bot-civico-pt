import React, { useEffect, useRef } from 'react';

interface ChatMessage {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

interface ChatMessagesProps {
    messages: ChatMessage[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="chat-messages" aria-live="polite">
            {messages.map((message) => (
                <div key={message.id} className={`message ${message.sender}`}>
                    <div className="bubble">{message.text}</div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatMessages;