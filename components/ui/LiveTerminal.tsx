'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import resumeData from '@/context/resume.json'

interface ApiCall {
  path: string
  ms: number
  body: Record<string, unknown>
}

const { user, experience_timeline: timeline } = resumeData
const latest = timeline[0]

// Every value comes from resume.json, so the panel stays true when the resume changes
const CALLS: ApiCall[] = [
  {
    path: '/api/me',
    ms: 38,
    body: {
      name: user.name,
      role: user.role,
      location: user.location,
      stack: ['Python', 'Node.js', 'AWS', 'Next.js'],
      open_to_work: true,
    },
  },
  {
    path: '/api/me/latest',
    ms: 42,
    body: {
      title: latest.title,
      date: latest.date,
      shipped: 'Stripe + Razorpay store',
      live: latest.link?.replace('https://', ''),
    },
  },
  {
    path: '/api/me/education',
    ms: 31,
    body: {
      degree: user.education.degree,
      batch: user.education.year,
      cgpa: Number(user.education.cgpa),
      certifications: user.certifications.length,
    },
  },
]

const TYPE_MS = 45 // per character of the command
const LINE_MS = 110 // per line of the response
const HOLD_MS = 6000 // how long a full response stays on screen

// Pretty-print, but keep arrays on one line so a response fits the panel
function toLines(body: Record<string, unknown>) {
  const entries = Object.entries(body).map(
    ([key, value], i, all) =>
      `  "${key}": ${JSON.stringify(value).replace(/","/g, '", "')}${i < all.length - 1 ? ',' : ''}`
  )
  return ['{', ...entries, '}']
}

// Minimal JSON highlighting: keys, strings, numbers/booleans
function JsonLine({ line }: { line: string }) {
  const match = line.match(/^(\s*)"([^"]+)":\s(.*)$/)
  if (!match) return <span className="text-slate-500">{line}</span>

  const [, indent, key, rawValue] = match
  const comma = rawValue.endsWith(',') ? ',' : ''
  const value = comma ? rawValue.slice(0, -1) : rawValue
  const valueClass = value.startsWith('"') || value.startsWith('[') ? 'text-amber-300' : 'text-violet-300'

  return (
    <span>
      {indent}
      <span className="text-sky-300">&quot;{key}&quot;</span>
      <span className="text-slate-500">: </span>
      <span className={valueClass}>{value}</span>
      <span className="text-slate-500">{comma}</span>
    </span>
  )
}

export function LiveTerminal() {
  const reduceMotion = useReducedMotion()
  const [callIndex, setCallIndex] = useState(0)
  const [typed, setTyped] = useState(0) // characters of the command typed so far
  const [shown, setShown] = useState(0) // response lines shown so far
  const scrollRef = useRef<HTMLDivElement>(null)

  const call = CALLS[callIndex]
  const command = `curl moinuddin.vercel.app${call.path}`
  const lines = toLines(call.body)

  useEffect(() => {
    if (reduceMotion) return

    let timer: ReturnType<typeof setTimeout>
    if (typed < command.length) {
      timer = setTimeout(() => setTyped((t) => t + 1), TYPE_MS)
    } else if (shown < lines.length + 1) {
      // +1 for the status line; pause a beat after the command finishes
      timer = setTimeout(() => setShown((s) => s + 1), shown === 0 ? 400 : LINE_MS)
    } else {
      timer = setTimeout(() => {
        setCallIndex((i) => (i + 1) % CALLS.length)
        setTyped(0)
        setShown(0)
      }, HOLD_MS)
    }
    return () => clearTimeout(timer)
  }, [reduceMotion, typed, shown, command.length, lines.length])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [shown])

  // Reduced motion: show the first call fully, no typing
  const typedCount = reduceMotion ? command.length : typed
  const shownCount = reduceMotion ? lines.length + 1 : shown
  const isTyping = typedCount < command.length

  return (
    <div className="h-64 w-full bg-black border border-white/10 rounded-xl overflow-hidden flex flex-col">
      {/* Terminal Header */}
      <div className="bg-slate-950 border-b border-white/10 px-4 py-2 flex items-center gap-2 flex-shrink-0">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-mono text-green-400 uppercase tracking-wider">API_CONSOLE</span>
        <span className="text-xs font-mono text-slate-600 truncate">GET {call.path}</span>
        <div className="ml-auto flex gap-1.5 flex-shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
        </div>
      </div>

      {/* Terminal Body */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 font-mono text-xs leading-[18px] scrollbar-terminal"
        aria-label={`Example API call: ${command}`}
      >
        <div className="text-green-400 break-all">
          <span className="text-green-500/60">$ </span>
          {command.slice(0, typedCount)}
          {isTyping && <span className="inline-block w-1.5 h-3.5 align-middle bg-green-400 animate-blink-cursor" />}
        </div>

        {shownCount > 0 && (
          <div className="mt-1 text-slate-500">
            <span className="text-green-400">200 OK</span> · application/json · {call.ms}ms
          </div>
        )}

        <pre className="mt-1 whitespace-pre-wrap">
          {lines.slice(0, Math.max(0, shownCount - 1)).map((line, i) => (
            <div key={`${callIndex}-${i}`}>
              <JsonLine line={line} />
            </div>
          ))}
        </pre>

        {!isTyping && shownCount > lines.length && (
          <div className="flex items-center gap-1 mt-2">
            <span className="text-green-400">$</span>
            <div className="w-1.5 h-3.5 bg-green-400 animate-blink-cursor" />
          </div>
        )}
      </div>
    </div>
  )
}
