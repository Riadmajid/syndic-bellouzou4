import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Chat({ user, userData }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Retrieve all chat documents without server‑side ordering. We'll sort client‑side to support messages that may lack a `createdAt` field.
    const q = query(collection(db, 'syndic_chat'));

    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => {
        const d = doc.data();
        return {
          firebaseId: doc.id,
          ...d
        };
      });
      // Client‑side sorting: prioritize `createdAt` timestamp if present, otherwise fall back to Firestore doc ID.
      msgs.sort((a, b) => {
        const aTime = a.createdAt?.seconds ?? a.firebaseId;
        const bTime = b.createdAt?.seconds ?? b.firebaseId;
        return aTime - bTime;
      });
      setMessages(msgs);

      setError(null);
    }, (err) => {
      console.error("Firestore Chat Listener Error:", err);
      setError("تعذر تحميل الرسائل. يرجى التأكد من تفعيل الحساب والاتصال بالإنترنت.");
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const input = e.target.msg;
    const msgText = input.value.trim();
    if (!msgText || loading) return;
    
    setLoading(true);
    setError(null);

    const newMsg = {
      name: userData?.name || (userData?.role === 'admin' ? 'Admin' : 'مجهول'),
      msg: msgText,
      time: new Date().toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' }),
      likes: 0,
      dislikes: 0,
      replies: [],
      isPrivate: false,
      senderUid: user?.uid || '',
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'syndic_chat'), newMsg);
      input.value = '';
    } catch (err) {
      console.error("Error sending message:", err);
      setError("فشل إرسال الرسالة: " + (err.message || "يرجى التحقق من الصلاحيات أو الاتصال بالإنترنت"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card chat-card">
      <h2>المحادثات والإعلانات 💬</h2>

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#b91c1c',
          padding: '10px 14px',
          borderRadius: '8px',
          marginBottom: '15px',
          fontSize: '14px'
        }}>
          ⚠️ {error}
        </div>
      )}
      
      <div className="chat-container">
        {messages.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>لا توجد رسائل حالياً.</p>
        ) : (
          messages.map(m => (
            <div key={m.firebaseId || m.id} className={`chat-message ${user && m.senderUid === user.uid ? 'my-message' : ''}`}>
              <div className="msg-header">
                <strong>{m.name}</strong>
                <span className="msg-time">{m.time}</span>
              </div>
              <p className="msg-body">{m.msg}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="chat-form">
        <input name="msg" type="text" placeholder="اكتب رسالتك هنا..." required disabled={loading} />
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'جاري الإرسال...' : 'إرسال'}
        </button>
      </form>
    </div>
  );
}

