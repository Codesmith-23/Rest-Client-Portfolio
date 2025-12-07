import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-card border border-border rounded-lg p-8 shadow-2xl">
          {/* JSON Response Card */}
          <div className="font-mono space-y-4">
            <div className="text-destructive text-sm mb-6">
              <span className="opacity-50">HTTP/1.1</span> 404 Not Found
            </div>
            
            <pre className="text-sm text-foreground/90 leading-relaxed">
{`{
  "error": "404_NOT_FOUND",
  "message": "The requested resource is outside the system boundary.",
  "action": "Return to Base"
}`}
            </pre>

            <div className="pt-6 flex justify-end">
              <Link 
                href="/"
                className="px-6 py-3 bg-primary text-primary-foreground font-mono text-sm rounded hover:bg-primary/90 transition-colors"
              >
                RETURN_HOME
              </Link>
            </div>
          </div>
        </div>

        {/* Terminal-style footer */}
        <div className="mt-4 text-center font-mono text-xs text-muted-foreground">
          <span className="opacity-50">$</span> curl -X GET {typeof window !== 'undefined' ? window.location.href : '[UNKNOWN_ENDPOINT]'}
        </div>
      </div>
    </div>
  )
}
