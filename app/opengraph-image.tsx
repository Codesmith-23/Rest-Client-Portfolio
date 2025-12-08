import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Moinuddin System Architecture'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#020617',
          color: '#e2e8f0',
          fontFamily: 'monospace',
        }}
      >
        {/* Main Card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '90%',
            height: '80%',
            backgroundColor: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            overflow: 'hidden',
          }}
        >
          {/* Card Header (Address Bar) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              padding: '20px 30px',
              borderBottom: '1px solid #1e293b',
              backgroundColor: '#1e293b',
            }}
          >
            {/* Traffic Lights */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <div
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: '50%',
                  background: '#ef4444',
                }}
              />
              <div
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: '50%',
                  background: '#f59e0b',
                }}
              />
              <div
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: '50%',
                  background: '#22c55e',
                }}
              />
            </div>

            {/* Address Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                flex: 1,
                backgroundColor: '#0f172a',
                padding: '12px 20px',
                borderRadius: '8px',
                border: '1px solid #334155',
              }}
            >
              <span style={{ color: '#22c55e', fontSize: 24, fontWeight: 'bold' }}>
                GET
              </span>
              <span style={{ color: '#94a3b8', fontSize: 22 }}>
                https://api.moinuddin.dev/v1/profile
              </span>
              <div
                style={{
                  marginLeft: 'auto',
                  backgroundColor: '#22c55e',
                  color: '#0f172a',
                  padding: '6px 16px',
                  borderRadius: '6px',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}
              >
                200 OK
              </div>
            </div>
          </div>

          {/* Card Body (JSON) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '40px 60px',
              fontSize: 40,
              lineHeight: 1.5,
            }}
          >
            <span style={{ color: '#64748b' }}>{`{`}</span>
            <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 40 }}>
              <span>
                <span style={{ color: '#38bdf8' }}>"architect"</span>:{' '}
                <span style={{ color: '#a5f3fc' }}>"Mohammed Moinuddin"</span>,
              </span>
              <span>
                <span style={{ color: '#38bdf8' }}>"role"</span>:{' '}
                <span style={{ color: '#facc15' }}>"Backend Systems Engineer"</span>,
              </span>
              <span>
                <span style={{ color: '#38bdf8' }}>"status"</span>:{' '}
                <span style={{ color: '#22c55e' }}>"ONLINE"</span>,
              </span>
              <span>
                <span style={{ color: '#38bdf8' }}>"stack"</span>: [
                <span style={{ color: '#c084fc' }}>"Java"</span>,{' '}
                <span style={{ color: '#c084fc' }}>"Python"</span>,{' '}
                <span style={{ color: '#c084fc' }}>"SQL"</span>]
              </span>
            </div>
            <span style={{ color: '#64748b' }}>{`}`}</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
