import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [appData, setAppData] = useState(null);

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(d => d.data()));
    });
    const unsubData = onSnapshot(doc(db, 'syndic_data', 'zaineb4'), (docSnap) => {
      if (docSnap.exists()) setAppData(docSnap.data());
    });
    return () => { unsubUsers(); unsubData(); };
  }, []);

  const approveUser = async (u) => {
    await updateDoc(doc(db, 'users', u.uid), { approved: true });
    
    if (appData) {
      let buildings = [...(appData.buildings || [])];
      let apartments = [...(appData.apartments || [])];

      let building = buildings.find(b => b.name.trim().toLowerCase() === u.building.trim().toLowerCase());
      if (!building) {
        building = { id: Date.now(), name: u.building.trim() };
        buildings.push(building);
      }

      let apt = apartments.find(a => a.buildingId === building.id && a.name.trim().toLowerCase() === u.apartment.trim().toLowerCase());
      if (!apt) {
        apt = { id: Date.now() + 1, buildingId: building.id, name: u.apartment.trim(), residentName: u.name, residentPhone: u.phone };
        apartments.push(apt);
      } else {
        apt.residentName = u.name;
        apt.residentPhone = u.phone;
      }

      await updateDoc(doc(db, 'syndic_data', 'zaineb4'), { buildings, apartments });
    }
  };

  const pendingUsers = users.filter(u => !u.approved);
  const approvedUsers = users.filter(u => u.approved);

  return (
    <div className="card admin-card">
      <h2>لوحة الإدارة ⚙️</h2>
      
      {/* --- طلبات الانضمام المعلقة --- */}
      <h3>طلبات الانضمام المعلقة ({pendingUsers.length})</h3>
      <div className="list-container">
        {pendingUsers.length === 0 ? <p>لا توجد طلبات معلقة.</p> : (
          pendingUsers.map(u => (
            <div key={u.uid} className="list-item">
              <div className="item-details">
                <strong>{u.name}</strong>
                <span>{u.building} - شقة {u.apartment}</span>
                <span className="phone-badge">📞 {u.phone || 'غير محدد'}</span>
              </div>
              <button onClick={() => approveUser(u)} className="submit-btn" style={{marginTop: 0, padding: '8px 16px'}}>قبول</button>
            </div>
          ))
        )}
      </div>

      {/* --- قائمة السكان المعتمدين --- */}
      <h3 style={{marginTop: '24px'}}>قائمة السكان ({approvedUsers.length})</h3>
      <div className="list-container">
        {approvedUsers.length === 0 ? <p>لا يوجد سكان معتمدون.</p> : (
          approvedUsers.map(u => (
            <div key={u.uid} className="list-item">
              <div className="item-details">
                <strong>{u.name}</strong>
                <span>{u.building} - شقة {u.apartment}</span>
                <span className="phone-badge">📞 {u.phone || 'غير محدد'}</span>
              </div>
              <span className="role-badge">{u.role === 'admin' ? '👑 مدير' : '🏠 مقيم'}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
