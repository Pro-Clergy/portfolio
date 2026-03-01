import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Mathias Aidoo — Software Engineer & Full-Stack Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#0a0a0f',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Accent glow */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,229,160,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            background: '#12121a',
            border: '2px solid #1a1a26',
            marginBottom: '40px',
          }}
        >
          <span style={{ fontSize: '44px', fontWeight: 800, color: '#00e5a0' }}>M</span>
        </div>

        {/* Name */}
        <h1 style={{ fontSize: '64px', fontWeight: 800, color: '#e8e6e3', margin: 0, lineHeight: 1.1 }}>
          Mathias Aidoo
        </h1>

        {/* Title */}
        <p style={{ fontSize: '28px', color: '#8a8a9a', margin: '16px 0 32px', fontWeight: 400 }}>
          Software Engineer & Full-Stack Developer
        </p>

        {/* Accent line */}
        <div style={{ width: '120px', height: '3px', background: '#00e5a0', marginBottom: '32px' }} />

        {/* Tech stack */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {['React', 'Next.js', 'Flutter', 'Python', 'Node.js'].map((tech) => (
            <span
              key={tech}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#12121a',
                border: '1px solid #1a1a26',
                color: '#8a8a9a',
                fontSize: '16px',
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Location */}
        <p style={{ fontSize: '18px', color: '#546e7a', marginTop: '32px' }}>
          Kumasi, Ghana 🇬🇭
        </p>
      </div>
    ),
    { ...size }
  );
}
