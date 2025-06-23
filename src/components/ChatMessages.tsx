import React, { useEffect, useRef } from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

interface ChatMessagesProps {
    messages: ChatMessage[];
    isLoading?: boolean;
}

const welcomeMessage = `Olá! Sou o Bot Cívico e estou aqui para o ajudar com informações sobre serviços públicos em Portugal.

Como utilizar:
Para obter informações, indique a cidade e o serviço que pretende consultar.

Cidades disponíveis:
• Angra do Heroísmo • Aveiro • Beja • Braga • Castelo Branco  
• Coimbra • Évora • Faro • Funchal • Guimarães  
• Leiria • Lisboa • Póvoa de Varzim • Porto • Portimão  
• Santarém • Setúbal • Viana do Castelo • Vila Nova de Gaia • Viseu

Serviços com os quais posso ajudar:
• Câmara Municipal – horários e moradas
• Cartão de Cidadão – locais de atendimento
• Transportes Públicos – informações sobre metro, autocarros, etc.
• Centros de Saúde – horários e localizações

Diga-me a cidade e o serviço que pretende consultar (como "Câmara do Porto" ou "Transportes em Lisboa") e eu ajudo!`;


const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading = false }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('pt-PT', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    return (
        <div className="chat-messages" aria-live="polite">
            {messages.length === 0 && (
                <div className="message bot">
                    <div className="message-avatar">
                        <Bot size={16} />
                    </div>
                    <div className="bubble">
                        <div className="message-text" style={{ whiteSpace: 'pre-line' }}>
                            {welcomeMessage}
                        </div>
                        <div className="message-time">{formatTime(new Date())}</div>
                    </div>
                </div>
            )}

            {messages.map((message) => (
                <div key={message.id} className={`message ${message.sender}`}>
                    <div className="message-avatar">
                        {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className="bubble">
                        {message.sender === 'bot' ? (
                            <div className="message-text" style={{ whiteSpace: 'pre-line' }}>
                                <ReactMarkdown
                                    components={{
                                        a: (props) => (
                                            <a {...props} target="_blank" rel="noopener noreferrer">
                                                {props.children}
                                            </a>
                                        ),
                                    }}
                                >
                                    {message.text}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <div className="message-text">{message.text}</div>
                        )}
                        <div className="message-time">
                            {formatTime(message.timestamp)}
                        </div>
                    </div>
                </div>
            ))}

            

            

            {isLoading && (
                <div className="loading-indicator">
                    <div className="loading-dots">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                    <span className="loading-text">Bot está a escrever...</span>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatMessages;
