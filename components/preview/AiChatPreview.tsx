'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Loader2, Terminal } from 'lucide-react';
import { ResumeData } from '@/lib/types';
import { useLogContext } from '@/context/LogContext';

interface Message {
  id: string;
  type: 'user' | 'system';
  content: string;
  timestamp: Date;
}

interface AiChatPreviewProps {
  data: ResumeData;
}

const quickChips = [
  { label: '/skills', query: 'list all skills' },
  { label: '/projects', query: 'show projects' },
  { label: '/contact', query: 'contact info' },
  { label: '/experience', query: 'work experience' }
];

export function AiChatPreview({ data }: AiChatPreviewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addLog } = useLogContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processQuery = async (query: string): Promise<string> => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: query }),
      });

      const data = await response.json();
      return data.response || '[ERR]: No response received.';
    } catch (error) {
      console.error('Chat API Error:', error);
      return '[ERR]: Connection lost. Offline mode active.';
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsProcessing(true);

    addLog('POST', `/api/chat - Processing: "${currentInput}"`);

    const response = await processQuery(currentInput);
    const systemMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'system',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, systemMessage]);
    setIsProcessing(false);
    addLog('SYSTEM', 'AI query processed - 200 OK');
  };

  const handleChipClick = async (query: string) => {
    if (isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    addLog('POST', `/api/chat - Processing: "${query}"`);

    const response = await processQuery(query);
    const systemMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'system',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, systemMessage]);
    setIsProcessing(false);
    addLog('SYSTEM', 'AI query processed - 200 OK');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative h-[calc(100dvh-140px)] w-full flex flex-col overflow-hidden bg-slate-950 isolate">
      {/* Layer A: Background Animation (z-0) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Infinite Drifting Grid */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(to right, #80808012 1px, transparent 1px), linear-gradient(to bottom, #80808012 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '40px 40px']
          }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 3
          }}
        />
        
        {/* Vignette Effect - Fades grid at top/bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950" />
      </div>
      
      {/* Layer B: Content (z-10) - Always on top */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex-none bg-slate-900/80 md:backdrop-blur-sm border-b border-green-500/30 p-4">
          <h2 className="text-lg font-bold text-green-400 font-mono">AI_TERMINAL</h2>
          <p className="text-xs text-slate-500 font-mono mt-1">POST /ai/query - Interactive Query System</p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto min-h-0 py-2 md:py-6 px-4 md:px-6 scrollbar-hide">
        {messages.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="mb-6 relative">
                <Terminal className="w-24 h-24 text-green-500/30 mx-auto" />
                <div className="absolute inset-0 bg-green-500/10 blur-3xl" />
              </div>
              
              <h3 className="text-2xl font-bold text-green-400 font-mono mb-2">
                AI_CORE_ONLINE
              </h3>
              
              <p className="text-slate-500 font-mono text-sm mb-4">
                Waiting for system query...
              </p>
              
              <div className="flex items-center justify-center gap-1 text-green-400 font-mono">
                <span>&gt;</span>
                <span className="animate-blink-cursor">_</span>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Messages */
          <>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex mb-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'user' ? (
                  <div className="max-w-[80%] bg-slate-800/50 md:backdrop-blur-sm text-slate-100 rounded-lg px-3 md:px-4 py-2 border border-slate-700">
                    <p className="text-xs md:text-sm">{message.content}</p>
                  </div>
                ) : (
                  <div className="max-w-[90%] bg-black/50 md:backdrop-blur-sm border border-green-500/30 rounded-lg px-3 md:px-4 py-2 md:py-3">
                    <pre className="text-xs md:text-sm text-green-400 font-mono whitespace-pre-wrap">
                      {message.content}
                    </pre>
                  </div>
                )}
              </motion.div>
            ))}
            
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start mb-4"
              >
                <div className="bg-black/50 md:backdrop-blur-sm border border-green-500/30 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-green-400 animate-spin" />
                    <span className="text-sm text-green-400 font-mono">Processing query...</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
        </div>

        {/* Quick Commands */}
        <div className="flex-none border-t border-slate-800/50 bg-slate-900/30 md:backdrop-blur-sm px-4 py-3">
          <p className="text-xs text-slate-500 font-mono mb-2">Quick Commands:</p>
          <div className="flex flex-wrap gap-2">
            {quickChips.map((chip) => (
              <Badge
                key={chip.label}
                variant="outline"
                className="cursor-pointer border-green-500/50 text-green-400 hover:bg-green-500/20 hover:shadow-lg hover:shadow-green-500/20 font-mono text-xs transition-all"
                onClick={() => handleChipClick(chip.query)}
              >
                {chip.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Input Area - Command Console */}
        <div className="flex-none z-20 p-3 md:p-4 border-t border-slate-800 bg-slate-950">
          <div className="flex gap-2 items-center">
            <span className="text-green-400 font-mono text-lg">&gt;</span>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter system query..."
              className="flex-1 bg-black/50 border border-slate-700 focus:border-green-500 text-green-400 placeholder:text-slate-600 font-mono transition-colors"
              disabled={isProcessing}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className="bg-transparent border-2 border-green-500 text-green-400 hover:bg-green-500/10 font-mono font-bold min-w-12 min-h-12 px-3 md:px-6"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">EXECUTE</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
