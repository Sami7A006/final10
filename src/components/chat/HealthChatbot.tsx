import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, AlertTriangle } from 'lucide-react';
import { findBestMatch } from '../../utils/healthData';

interface Message {
  type: 'user' | 'bot';
  content: string;
}

interface HealthChatbotProps {
  onNavigate?: (page: string) => void;
}

const HealthChatbot: React.FC<HealthChatbotProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: 'Hello! I\'m your health assistant. I can provide general health information and wellness tips. Please describe your health concerns, and I\'ll do my best to help. Remember, this is for informational purposes only - always consult a healthcare professional for medical advice.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastRequestTime = useRef<number>(0);
  const MIN_REQUEST_INTERVAL = 1000; // Minimum 1 second between requests

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime.current;
    
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      setError('Please wait a moment before sending another message.');
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsTyping(true);
    setError(null);

    try {
      // Simulate network delay for more natural interaction
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = findBestMatch(userMessage);
      let botResponse = response.answer;
      
      if (response.tips && response.tips.length > 0) {
        botResponse += '\n\nHere are some helpful tips:\n' + 
          response.tips.map(tip => `• ${tip}`).join('\n');
      }

      setMessages(prev => [...prev, { type: 'bot', content: botResponse }]);
    } catch (err) {
      console.error('Chat error:', err);
      setError('Failed to process your request. Please try again.');
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: 'I apologize, but I encountered an error processing your request. Please try again in a moment.' 
      }]);
    } finally {
      setIsTyping(false);
      lastRequestTime.current = Date.now();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => onNavigate?.('home')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Home
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800/30">
          <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-400">
            <AlertTriangle className="h-5 w-5" />
            <p className="font-medium">Medical Disclaimer</p>
          </div>
          <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
            This AI assistant provides general information only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider.
          </p>
        </div>

        <div className="h-[400px] overflow-y-auto mb-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}
              >
                <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your health concern..."
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={`
              p-2 rounded-lg text-white
              ${!input.trim() || isTyping
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'}
            `}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default HealthChatbot;