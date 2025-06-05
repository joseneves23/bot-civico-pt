import React, { useState } from 'react';

interface ChatInputProps {
    onSend: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onSend(inputValue);
            setInputValue('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="chat-input" autoComplete="off">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite a sua mensagem..."
                className="input-field"
                aria-label="Digite a sua mensagem"
                autoFocus
            />
            <button type="submit" className="send-button" aria-label="Enviar mensagem">
                Enviar
            </button>
        </form>
    );
};

export default ChatInput;