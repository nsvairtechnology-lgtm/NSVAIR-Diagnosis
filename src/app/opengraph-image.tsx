import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'NSVAIR Diagnosis — AI-Powered Multi-Modal Health Diagnostic Platform | Powered by NSVAIR GROUP OF INDUSTRY'
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
            'linear-gradient(135deg, #022c22 0%, #064e3b 30%, #065f46 60%, #0f766e 85%, #0369a1 100%)',
          color: 'white',
          padding: '50px 60px',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow circles */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(52, 211, 153, 0.25) 0%, rgba(52, 211, 153, 0) 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-150px',
            left: '-100px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, rgba(14, 165, 233, 0) 70%)',
          }}
        />

        {/* Decorative EKG wave background */}
        <svg
          width="1200"
          height="160"
          viewBox="0 0 1200 160"
          style={{
            position: 'absolute',
            bottom: '15px',
            left: '0',
            opacity: '0.18',
          }}
        >
          <path
            d="M 0 110 L 220 110 L 270 50 L 330 150 L 390 20 L 440 120 L 480 80 L 520 110 L 1200 110"
            stroke="#a7f3d0"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Top Header row: Brand logo, name & Powered By badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
            }}
          >
            {/* Insignia Icon */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                border: '2px solid rgba(255,255,255,0.3)',
              }}
            >
              <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
                <path
                  d="M 6 26 L 14 26 L 18 16 L 24 36 L 30 10 L 34 26 L 42 26"
                  stroke="#ffffff"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="34" cy="26" r="2.5" fill="#fef08a" />
              </svg>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '34px', fontWeight: 900, letterSpacing: '-0.02em' }}>
                  NSVAIR
                </span>
                <span
                  style={{
                    fontSize: '34px',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    color: '#34d399',
                  }}
                >
                  DIAGNOSIS
                </span>
              </div>
              <span
                style={{
                  fontSize: '13px',
                  letterSpacing: '0.12em',
                  fontWeight: 700,
                  color: '#fef08a',
                  textTransform: 'uppercase',
                }}
              >
                ✦ POWERED BY NSVAIR GROUP OF INDUSTRY
              </span>
            </div>
          </div>

          {/* AI Platform Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              background: 'rgba(255, 255, 255, 0.12)',
              borderRadius: '999px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              fontSize: '14px',
              fontWeight: 600,
              color: '#ffffff',
            }}
          >
            <span>⚡ 16 Agentic AI Screenings</span>
          </div>
        </div>

        {/* Main Headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '32px',
            gap: '12px',
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: '56px',
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              display: 'flex',
            }}
          >
            Complete Agentic AI Health Diagnostics
          </div>
          <div
            style={{
              fontSize: '44px',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              display: 'flex',
              background: 'linear-gradient(90deg, #fef08a 0%, #34d399 50%, #38bdf8 100%)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            All-in-one real-time medical screening.
          </div>
          <div
            style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.85)',
              maxWidth: '960px',
              lineHeight: 1.45,
              marginTop: '4px',
              display: 'flex',
            }}
          >
            Turn your phone into a diagnostic lab with camera rPPG vitals, skin &amp; eye computer vision,
            speech analysis, posture, and conversational symptom triage.
          </div>
        </div>

        {/* 16 Module chips bar */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            marginTop: 'auto',
          }}
        >
          {[
            '📷 Skin',
            '👁 Eye',
            '😊 Face',
            '🦷 Dental',
            '💅 Nail',
            '💇 Hair',
            '🧍 Posture',
            '🎤 Voice & Cough',
            '🩺 Symptoms',
            '❤️ Vitals (rPPG)',
            '🧠 Mental',
            '💤 Sleep',
            '🥗 Nutrition',
            '👁️ Vision',
            '👂 Hearing',
            '⚡ Reaction',
          ].map((chip) => (
            <div
              key={chip}
              style={{
                display: 'flex',
                padding: '6px 14px',
                background: 'rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#ffffff',
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
