import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
    onSend: (message: string) => void;
    isLoading?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading = false }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = () => {
        if (inputValue.trim() && !isLoading) {
            onSend(inputValue);
            setInputValue('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="chat-input">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite a sua mensagem..."
                className="input-field"
                aria-label="Digite a sua mensagem"
                autoFocus
                disabled={isLoading}
            />
            <button 
                onClick={handleSubmit}
                disabled={!inputValue.trim() || isLoading}
                className="send-button" 
                aria-label="Enviar mensagem"
            >
                <Send size={18} />
                Enviar
            </button>
        </div>
    );
};

export default ChatInput;