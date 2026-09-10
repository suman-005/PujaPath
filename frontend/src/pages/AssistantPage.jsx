import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';

const QUICK_PROMPTS = [
  'Which Puja has parking?',
  'Which Puja has wheelchair accessibility?',
  'Which Pujas have food stalls?',
  'Where is the nearest hospital or emergency contact?',
  'Which Puja has a traditional or heritage theme?',
];

export function AssistantPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: 'Hello! I am PujaPath Assistant. Ask me about Puja locations, themes, parking, facilities, crowd levels, and emergency contacts in Purba Bardhaman.',
      sources: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await api.askAssistant(query);
      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: response.answer || "I couldn't find verified information about that in the PujaPath database.",
        sources: response.sources || [],
        disclaimer: response.disclaimer,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError(err.message || 'PujaPath Assistant is temporarily unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: '840px', margin: '0 auto', padding: '20px 16px 80px 16px' }}>
      <header style={{ marginBottom: '16px', borderBottom: '2px solid #e0e0e0', paddingBottom: '12px' }}>
        <h1 style={{ color: '#8b0000', fontSize: '26px', margin: '0 0 6px 0', fontWeight: '800' }}>
          PujaPath AI Assistant
        </h1>
        <p style={{ color: '#555', margin: 0, fontSize: '14px' }}>
          Database-grounded answers for pandals, facilities, and emergency assistance in Purba Bardhaman.
        </p>
      </header>

      {/* Quick Questions */}
      <section aria-label="Suggested quick questions" style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', fontWeight: '700', color: '#666', marginBottom: '8px' }}>
          SUGGESTED QUESTIONS:
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSend(prompt)}
              disabled={loading}
              style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #d0d5dd',
                borderRadius: '16px',
                padding: '6px 12px',
                fontSize: '12px',
                color: '#333',
                cursor: loading ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                fontWeight: '500',
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
      </section>

      {/* Chat Messages Container */}
      <div
        style={{
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          minHeight: '380px',
          maxHeight: '540px',
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '85%',
                backgroundColor: msg.sender === 'user' ? '#8b0000' : '#f4f6f8',
                color: msg.sender === 'user' ? '#ffffff' : '#222222',
                padding: '12px 16px',
                borderRadius: msg.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                fontSize: '14px',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {msg.text}

              {/* Verified Sources Pill */}
              {msg.sources && msg.sources.length > 0 && (
                <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #ddd', fontSize: '11px', color: '#555' }}>
                  <strong>Verified Sources:</strong>{' '}
                  {msg.sources.map((s) => s.name).join(', ')}
                </div>
              )}

              {msg.disclaimer && (
                <div style={{ marginTop: '6px', fontSize: '10px', color: '#777', fontStyle: 'italic' }}>
                  {msg.disclaimer}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ alignSelf: 'flex-start', backgroundColor: '#f4f6f8', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', color: '#666' }}>
            Searching verified PujaPath records...
          </div>
        )}

        {error && (
          <div role="alert" style={{ backgroundColor: '#fce8e6', color: '#c5221f', padding: '10px 14px', borderRadius: '6px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box and Send Controls */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{ display: 'flex', gap: '8px', marginTop: '14px' }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Pujas, parking, themes, crowd or emergency..."
          aria-label="Ask PujaPath Assistant"
          maxLength={500}
          disabled={loading}
          style={{
            flex: 1,
            padding: '12px 14px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            backgroundColor: loading || !input.trim() ? '#ccc' : '#8b0000',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '12px 20px',
            fontWeight: '700',
            fontSize: '14px',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            minHeight: '44px',
          }}
        >
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </main>
  );
}

export default AssistantPage;