import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import { ChatMessage, Doctor, User } from '../types';
import { startChatSessionWithContext } from '../services/geminiChatService';
import Alert from './ui/Alert';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  doctors: Doctor[];
  user: User | null;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, doctors, user }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      try {
        // Start a new chat session with the latest doctor and user context
        const chatSession = startChatSessionWithContext(doctors, user);
        setChat(chatSession);
        setMessages([
          { id: Date.now(), role: 'model', text: 'Hello! I am the Health Care AI assistant. How can I help you today? You can ask me about our doctors or general health questions.' }
        ]);
      } catch (e: any) {
        setError(e.message || "Failed to start chat session.");
      }
    } else {
      // Clear session when closed
      setChat(null);
      setMessages([]);
    }
  }, [isOpen, doctors, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !chat || isLoading) return;

    const text = userInput.trim();
    setUserInput('');
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text }]);
    setIsLoading(true);
    setError('');

    try {
      const stream = await chat.sendMessageStream({ message: text });
      let modelResponse = '';
      const modelMessageId = Date.now();
      
      setMessages(prev => [...prev, { id: modelMessageId, role: 'model', text: '' }]);

      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setMessages(prev => 
          prev.map(msg => 
            msg.id === modelMessageId ? { ...msg, text: modelResponse } : msg
          )
        );
      }
    } catch (err) {
      setError('Sorry, something went wrong. Please try again.');
      setMessages(prev => [...prev, { id: Date.now(), role: 'model', text: 'I encountered an error. Please try sending your message again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Health Assistant">
      <div className="flex flex-col h-[60vh]">
        <div className="flex-1 overflow-y-auto space-y-4 bg-slate-50 p-4 rounded-md no-scrollbar">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                  message.role === 'user' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.text || '...'}</p>
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length -1]?.role === 'user' && (
             <div className="flex justify-start">
                <div className="bg-gray-200 rounded-lg px-4 py-2 text-gray-800">
                    <Spinner/>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="mt-4">
          {error && <Alert type="error" message={error} onClose={() => setError('')}/>}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask about doctors or health..."
              className="w-full px-3 py-2 bg-slate-200 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled={isLoading}
            />
            <Button type="submit" isLoading={isLoading} disabled={!userInput.trim() || isLoading}>
              Send
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default Chatbot;