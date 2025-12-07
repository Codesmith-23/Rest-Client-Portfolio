'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console in development
    console.error('Runtime error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-destructive/10 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* BSOD-style Error Screen */}
        <div className="bg-destructive text-destructive-foreground rounded-lg p-8 shadow-2xl border-4 border-destructive">
          <div className="font-mono space-y-6">
            {/* Header */}
            <div className="text-center pb-4 border-b-2 border-destructive-foreground/20">
              <h1 className="text-3xl font-bold tracking-wider">
                SYSTEM CRITICAL FAILURE
              </h1>
              <p className="text-sm mt-2 opacity-80">
                A runtime exception has been detected
              </p>
            </div>

            {/* Error Details */}
            <div className="space-y-4">
              <div className="bg-destructive-foreground/10 p-4 rounded">
                <p className="text-sm font-bold mb-2">[CRITICAL_ERROR]:</p>
                <p className="text-xs opacity-90 break-words">
                  {error.message || 'Unknown runtime exception'}
                </p>
                {error.digest && (
                  <p className="text-xs opacity-60 mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>

              <div className="text-xs opacity-70 space-y-1">
                <p>→ The application encountered an unexpected error</p>
                <p>→ System state may be inconsistent</p>
                <p>→ Attempting recovery protocol...</p>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 flex justify-center">
              <button
                onClick={reset}
                className="px-8 py-3 bg-destructive-foreground text-destructive font-bold text-sm rounded hover:opacity-90 transition-opacity uppercase tracking-wider"
              >
                ⟳ REBOOT SYSTEM
              </button>
            </div>

            {/* Footer */}
            <div className="text-center text-xs opacity-50 pt-4 border-t border-destructive-foreground/20">
              If the problem persists, contact system administrator
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
