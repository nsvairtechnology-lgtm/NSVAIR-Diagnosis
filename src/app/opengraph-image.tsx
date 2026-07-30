import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'NSVAIR Diagnosis — AI-Powered Multi-Modal Health Diagnostic Platform'
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
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background:
            'linear-gradient(135deg, #064e3b 0%, #047857 35%, #0d9488 70%, #0891b2 100%)',
          color: 'white',
          padding: '60px 70px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative pulse line */}
        <svg
          width="1200"
          height="200"
          viewBox="0 0 1200 200"
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            opacity: '0.12',
          }}
        >
          <path
            d="M 0 150 L 200 150 L 260 90 L 320 180 L 380 60 L 440 150 L 1200 150"
            stroke="white"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Top row: logo + brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            fontSize: '32px',
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
            }}
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path
                d="M 6 28 L 14 28 L 18 18 L 24 38 L 30 12 L 34 28 L 42 28"
                stroke="#10b981"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '36px', lineHeight: 1.1 }}>NSVAIR</span>
            <span style={{ fontSize: '18px', opacity: 0.8, fontWeight: 400 }}>
              AI Diagnostic Platform
            </span>
          </div>
        </div>

        {/* Main headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '40px',
            gap: '16px',
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: '64px',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              display: 'flex',
            }}
          >
            Complete health
          </div>
          <div
            style={{
              fontSize: '64px',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              display: 'flex',
              background: 'linear-gradient(90deg, #fef3c7, #fbbf24)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            diagnostics in one place.
          </div>
          <div
            style={{
              fontSize: '24px',
              opacity: 0.9,
              maxWidth: '900px',
              lineHeight: 1.4,
              marginTop: '10px',
              display: 'flex',
            }}
          >
            8 AI-powered screenings using your phone&apos;s camera, mic, motion &amp; touch —
            synthesized into one comprehensive real-time report.
          </div>
        </div>

        {/* Bottom row: feature chips */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginTop: '20px',
          }}
        >
          {[
            '📷 Skin',
            '👁 Eye',
            '😊 Face',
            '🎤 Voice',
            '🩺 Symptoms',
            '🧠 Mental',
            '❤️ Vitals',
            '⚡ Reaction',
          ].map((chip) => (
            <div
              key={chip}
              style={{
                display: 'flex',
                padding: '10px 18px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '999px',
                fontSize: '18px',
                fontWeight: 500,
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
