/** Persistent banner on all portal routes — clarifies this is not a real bank (Safe Browsing mitigation). */
export default function DemoSiteBanner() {
  return (
    <div
      role="note"
      aria-label="Demonstration site notice"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        background: '#1e3a5f',
        color: '#f8fafc',
        textAlign: 'center',
        padding: '8px 12px',
        fontSize: '11px',
        fontWeight: 600,
        lineHeight: 1.45,
        fontFamily: 'Inter, system-ui, sans-serif',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      }}
    >
      DEMO / PORTFOLIO PROJECT — Not a real bank. No real money or financial services.{' '}
      <a href="/about-demo.html" target="_blank" rel="noopener noreferrer" style={{ color: '#93c5fd' }}>
        About this demo
      </a>
    </div>
  );
}
