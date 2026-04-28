// src/components/ChatWidget.jsx
import { useState, useRef, useEffect } from 'react';

const QUICK = ['Check symptoms', 'Book appointment', 'Lab report help', 'Medicine info'];

const LOCAL_RESPONSES = [
  "Based on your symptoms, I recommend consulting a doctor. Would you like to book a telemedicine consultation?",
  "Staying hydrated and getting 7-8 hours of sleep is important for good health.",
  "I provide general health guidance. For specific medical advice, please consult a doctor.",
  "Persistent symptoms should be evaluated by a doctor. I can help you book a consultation.",
  "For emergencies, please call 108 immediately.",
  "Regular health check-ups are important. Check our Diagnostic Lab section.",
  "Pain that is persistent should be evaluated by a doctor as soon as possible.",
  "Use our Health Tracker to log your daily vitals.",
  "Medicines can be delivered to your door through our Pharmacy section.",
];

export default function ChatWidget({ addToast, logVault }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { role: 'bot', text: "Hi! 👋 I'm your AI health assistant. Ask me anything about symptoms, medications, or health tips!" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const msgsRef = useRef(null);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [msgs]);

  const send = async (msg = input.trim()) => {
    if (!msg || loading) return;
    setMsgs(prev => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const randomResponse = LOCAL_RESPONSES[Math.floor(Math.random() * LOCAL_RESPONSES.length)];
      setMsgs(prev => [...prev, { role: 'bot', text: randomResponse + " How else can I help you today?" }]);
      setLoading(false);
      if (logVault) logVault('Chat Query', msg.substring(0, 50), 'general');
      if (addToast) addToast('Response generated!', 'success');
    }, 1000);
  };

  return (
    <>
      {!open && (
        <button className="chat-btn" onClick={() => setOpen(true)}>
          <i className="bi bi-chat-dots-fill" />
        </button>
      )}

      {open && (
        <div className="chat-panel">
          <div className="chat-head">
            <div>
              <i className="bi bi-robot me-2" />
              <strong>AI Health Assistant</strong>
              <div style={{ fontSize: '.8rem', opacity: .75 }}>Powered by SymptoCare AI</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,.2)', border: 'none', color: '#fff', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 14 }}>✕</button>
          </div>

          <div className="chat-msgs" ref={msgsRef}>
            {msgs.map((m, i) => (
              <div key={i} className={`bubble ${m.role}`}>
                {m.role === 'bot' && <strong style={{ color: 'var(--blue)', display: 'block', marginBottom: 4 }}>SymptoCare AI</strong>}
                <p style={{ margin: 0 }}>{m.text}</p>
              </div>
            ))}
            {loading && (
              <div className="bubble bot">
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '4px 0' }}>
                  {[0, 0.2, 0.4].map((d, i) => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--blue)', opacity: 0.5, animation: `pulse 1.2s infinite ${d}s` }} />
                  ))}
                </div>
              </div>
            )}
            {msgs.length === 1 && (
              <div className="bubble bot">
                <p style={{ margin: '0 0 8px' }}>Quick actions:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {QUICK.map(q => (
                    <button key={q} className="stag" style={{ fontSize: '.78rem', padding: '6px 12px', margin: 0 }} onClick={() => send(q)}>{q}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="chat-foot">
            <input
              type="text"
              className="form-control"
              placeholder="Ask a health question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              disabled={loading}
            />
            <button className="btn-primary" style={{ padding: '11px 16px', flexShrink: 0 }} onClick={() => send()} disabled={loading}>
              <i className="bi bi-send-fill" />
            </button>
          </div>
        </div>
      )}

      <style>{`
        .chat-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          z-index: 1000;
          transition: transform 0.2s;
        }
        .chat-btn:hover { transform: scale(1.05); }
        .chat-panel {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 380px;
          max-width: calc(100vw - 48px);
          height: 560px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 1001;
        }
        .chat-head {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .chat-msgs {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background: #f8fafc;
        }
        .bubble {
          margin-bottom: 12px;
          max-width: 85%;
          padding: 10px 14px;
          border-radius: 16px;
          font-size: 13px;
          line-height: 1.5;
        }
        .bubble.user {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          margin-left: auto;
          border-radius: 16px 16px 4px 16px;
        }
        .bubble.bot {
          background: white;
          border: 1px solid #e2e8f0;
          color: #1f2937;
          border-radius: 16px 16px 16px 4px;
        }
        .chat-foot {
          padding: 12px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          gap: 8px;
          background: white;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
}