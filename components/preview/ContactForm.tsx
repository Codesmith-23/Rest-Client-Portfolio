'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Send, Loader2 } from 'lucide-react';
import { useLogContext } from '@/context/LogContext';
import { TextScramble } from '@/components/animations/TextScramble';

// LAYER A: Global Packet Rain - Double-buffered for seamless loop
const GlobalPacketRain = () => {
  // Generate particle configuration (shared by both streams)
  const generateParticles = (streamId: string, count: number) => {
    return Array.from({ length: count }, (_, i) => {
      const duration = Math.random() * 10 + 15; // 15-25 seconds
      return {
        id: `${streamId}-${i}`,
        left: `${Math.random() * 100}%`,
        size: Math.random() > 0.6 ? 'w-2.5 h-2.5' : 'w-2 h-2',
        duration,
        delay: -(Math.random() * duration) // Pre-warmed state
      };
    });
  };

  // Stream A: Primary particles
  const streamA = generateParticles('stream-a', 25);
  
  // Stream B: Overlapping particles with -10s offset for seamless coverage
  const streamB = generateParticles('stream-b', 25);

  return (
    <div 
      className="fixed top-14 bottom-0 left-0 right-0 z-0 pointer-events-none overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
      }}
    >
      {/* Stream A: Primary flow */}
      {streamA.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute ${particle.size} bg-green-500/40 rounded-sm`}
          style={{ 
            left: particle.left,
            boxShadow: '0 0 8px rgba(34, 197, 94, 0.5)'
          }}
          animate={{ y: ['100vh', '-20vh'] }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: particle.delay
          }}
        />
      ))}
      
      {/* Stream B: Overlapping flow with -10s offset to eliminate gaps */}
      {streamB.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute ${particle.size} bg-green-500/40 rounded-sm`}
          style={{ 
            left: particle.left,
            boxShadow: '0 0 8px rgba(34, 197, 94, 0.5)'
          }}
          animate={{ y: ['100vh', '-20vh'] }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: particle.delay - 10 // Additional -10s offset for double-buffering
          }}
        />
      ))}
    </div>
  );
};

export function ContactForm() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [trap, setTrap] = useState(''); // Honeypot field
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [scrambleKey, setScrambleKey] = useState(0);
  const { addLog } = useLogContext();

  // Scramble text every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setScrambleKey(prev => prev + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    // Client-side validation
    if (!email || !subject || !message) {
      toast.error('Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (message.length < 10) {
      toast.error('Message must be at least 10 characters');
      return;
    }

    if (message.length > 1000) {
      toast.error('Message is too long (max 1000 characters)');
      return;
    }

    setIsLoading(true);
    
    // Log the POST request
    addLog('POST', '/api/send - Payload received');

    try {
      // Call the secure API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          subject,
          message,
          trap, // Honeypot field (should be empty for humans)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Message sent successfully!', {
          description: '201 Created - I\'ll get back to you soon.',
        });
        
        // Reset form
        setEmail('');
        setSubject('');
        setMessage('');
        setTrap('');
      } else if (response.status === 429) {
        toast.error('Too many requests', {
          description: 'Please wait a minute before trying again.',
        });
      } else if (response.status === 400) {
        toast.error('Validation error', {
          description: data.details?.[0]?.message || data.error || 'Please check your input.',
        });
      } else {
        toast.error('Failed to send message', {
          description: data.error || 'Please try again later.',
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Network error', {
        description: 'Please check your connection and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-full p-4 md:p-6 pb-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* LAYER A: Global Packet Rain - Fills the void */}
      <GlobalPacketRain />
      
      <Card className="w-full max-w-md md:max-w-2xl mx-auto bg-slate-900/80 md:backdrop-blur-sm border-2 border-yellow-500/30 shadow-2xl shadow-yellow-500/20 relative overflow-hidden z-10">
        <CardHeader className="relative z-20 p-3 md:p-6">
          <CardTitle className="text-lg md:text-3xl text-yellow-400 font-mono font-bold">ENCRYPTED_MESSAGE_CHANNEL</CardTitle>
          <p className="text-xs md:text-sm text-slate-400 mt-2 font-mono">
            <TextScramble key={scrambleKey} text="Direct message payload to admin" speed={40} />
          </p>
        </CardHeader>
        
        <CardContent className="space-y-3 md:space-y-6 relative z-20 p-3 md:p-6">
          {/* Honeypot field - hidden from users, visible to bots */}
          <input
            type="text"
            name="trap"
            value={trap}
            onChange={(e) => setTrap(e.target.value)}
            style={{ 
              position: 'absolute',
              left: '-9999px',
              width: '1px',
              height: '1px',
              opacity: 0,
              pointerEvents: 'none'
            }}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          {/* Mock JSON Editor Style */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 md:p-6 font-mono text-sm space-y-4">
            {/* From Field (Email) */}
            <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-3">
              <span className="text-cyan-400 w-full md:w-auto md:mt-2.5 md:min-w-[80px] text-left mb-1 md:mb-0">"from":</span>
              <div className="flex-1 w-full relative">
                {/* Targeting Crosshair */}
                {focusedField === 'email' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-green-400" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-green-400" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-green-400" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-green-400" />
                  </motion.div>
                )}
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="your.email@example.com"
                  className="bg-slate-900 border-slate-700 focus:border-green-500 text-green-400 placeholder:text-slate-600 font-mono text-sm transition-colors"
                  required
                />
              </div>
            </div>

            {/* Subject Field */}
            <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-3">
              <span className="text-cyan-400 w-full md:w-auto md:mt-2.5 md:min-w-[80px] text-left mb-1 md:mb-0">"subject":</span>
              <div className="flex-1 w-full relative">
                {/* Targeting Crosshair */}
                {focusedField === 'subject' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-green-400" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-green-400" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-green-400" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-green-400" />
                  </motion.div>
                )}
                <Input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  onFocus={() => setFocusedField('subject')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter subject..."
                  className="bg-slate-900 border-slate-700 focus:border-green-500 text-green-400 placeholder:text-slate-600 font-mono text-sm transition-colors"
                  required
                />
              </div>
            </div>

            {/* Message Field */}
            <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-3">
              <span className="text-cyan-400 w-full md:w-auto md:mt-2.5 md:min-w-[80px] text-left mb-1 md:mb-0">"message":</span>
              <div className="flex-1 w-full relative">
                {/* Targeting Crosshair */}
                {focusedField === 'message' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-green-400" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-green-400" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-green-400" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-green-400" />
                  </motion.div>
                )}
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Type your message here... (min 10 chars)"
                  rows={8}
                  className="bg-slate-900 border-slate-700 focus:border-green-500 text-green-400 placeholder:text-slate-600 font-mono text-sm resize-none transition-colors"
                  required
                  minLength={10}
                  maxLength={1000}
                />
                <div className="text-xs text-slate-500 mt-1 text-right">
                  {message.length}/1000 characters
                </div>
              </div>
            </div>
          </div>

          {/* Send Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSend}
              disabled={isLoading || !email || !subject || !message}
              size="lg"
              className="bg-yellow-600 hover:bg-yellow-700 text-slate-900 font-semibold font-mono min-w-[120px] md:min-w-[160px] h-10 md:h-12 text-sm md:text-base shadow-lg shadow-yellow-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  TRANSMIT
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
