'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LogEntry {
  id: string
  text: string
  timestamp: string
}

const LOG_TEMPLATES = [
  '[GET] /api/user/moinuddin_projects → 200 OK',
  '[POST] /deploy/snapstream → AWS_PROVISION_COMPLETE',
  '[QUERY] postgresql.competencies → 23 skills returned',
  '[ML_INFERENCE] deepfake_engine → 94% confidence',
  '[DEPLOY] Nginx_Gunicorn → SUCCESS (12.4ms)',
  '[AUTH] User connected from Mumbai, India',
  '[GET] /api/github/repos → 6 projects fetched',
  '[POST] /ai/query → Gemini_API_response (142ms)',
  '[CACHE] Redis.session_store → HIT (2.1ms)',
  '[BUILD] Docker.container → IMAGE_READY',
  '[DB] Firestore.sync → 15 documents updated',
  '[API] Stripe.checkout → PAYMENT_SUCCESS',
  '[ML] TensorFlow.lstm_model → Training epoch 45/50',
  '[DEPLOY] Vercel.production → LIVE',
  '[SOCKET] WebSocket.handshake → ESTABLISHED',
  '[GET] /api/experience/log → 3 records returned',
  '[SECURITY] JWT.verify → TOKEN_VALID',
  '[STORAGE] MinIO.upload → 2.4MB transferred',
  '[QUERY] DynamoDB.user_sessions → 12 active',
  '[API] Razorpay.webhook → PAYMENT_CAPTURED',
]

export function LiveTerminal() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Generate logs at random intervals
  useEffect(() => {
    if (!isMounted) return

    const addLog = () => {
      const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)]
      const now = new Date()
      const timestamp = now.toTimeString().split(' ')[0] // HH:MM:SS

      const newLog: LogEntry = {
        id: `${Date.now()}-${Math.random()}`,
        text: template,
        timestamp,
      }

      setLogs((prev) => {
        const updated = [...prev, newLog]
        // Keep only last 20 logs to prevent memory bloat
        return updated.slice(-20)
      })
    }

    // Add initial log immediately
    addLog()

    // Then add logs at random intervals (1.5s - 3s)
    const scheduleNext = () => {
      const delay = 1500 + Math.random() * 1500 // 1.5s to 3s
      return setTimeout(() => {
        addLog()
        intervalRef.current = scheduleNext()
      }, delay)
    }

    let intervalRef = { current: scheduleNext() }

    return () => {
      clearTimeout(intervalRef.current)
    }
  }, [isMounted])

  // Auto-scroll to bottom when new logs appear
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  // Show placeholder skeleton until mounted
  if (!isMounted) {
    return (
      <div className="h-64 w-full bg-black border border-white/10 rounded-xl p-4 overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-slate-600 animate-pulse" />
          <span className="text-xs font-mono text-slate-600 uppercase tracking-wider">
            TERMINAL_INITIALIZING...
          </span>
        </div>
        <div className="space-y-2">
          {[75, 90, 60, 85, 70, 55].map((width, i) => (
            <div
              key={i}
              className="h-4 bg-slate-900/50 rounded animate-pulse"
              style={{ width: `${width}%` }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-64 w-full bg-black border border-white/10 rounded-xl overflow-hidden flex flex-col">
      {/* Terminal Header */}
      <div className="bg-slate-950 border-b border-white/10 px-4 py-2 flex items-center gap-2 flex-shrink-0">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-mono text-green-400 uppercase tracking-wider">
          SYSTEM_MONITOR: LIVE
        </span>
        <div className="ml-auto flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
        </div>
      </div>

      {/* Scrollable Terminal Body */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-1 scrollbar-terminal"
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="font-mono text-xs text-green-400/90 leading-relaxed"
            >
              <span className="text-green-500/50">[{log.timestamp}]</span>{' '}
              <span className="text-green-400">{log.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Blinking cursor */}
        <div className="flex items-center gap-1 mt-2">
          <span className="text-green-400 font-mono text-xs">{'>'}</span>
          <div className="w-1.5 h-3.5 bg-green-400 animate-blink-cursor" />
        </div>
      </div>
    </div>
  )
}
