export default function TestCard() {
  return (
    <div 
      style={{
        background: 'linear-gradient(to right, #3b82f6, #22c55e)',
        color: 'white',
        padding: '20px',
        borderRadius: '16px',
        margin: '10px',
        minHeight: '100px'
      }}
    >
      <h2 style={{ color: 'white', margin: '0 0 10px 0' }}>Test Card</h2>
      <p style={{ color: 'white', margin: '0' }}>This is a test to see if text is visible</p>
      <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>42</div>
    </div>
  );
}