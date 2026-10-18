import { useState, useRef } from 'react';
import BookingCard from './components/BookingCard.jsx';
import DetailsPanel from './components/DetailsPanel.jsx';
import BookingModal from './components/BookingModal.jsx';
import { ACTIVITIES, fmtDate } from './data.js';

export default function App() {
  const [current, setCurrent] = useState('kayak');
  const [phase, setPhase] = useState('');          // '' | 'out' | 'in'
  const [booked, setBooked] = useState({ kayak: null, camp: null });
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState('');
  const timer = useRef();

  const switchTo = (key) => {
    if (key === current || phase) return;
    setPhase('out');                                // flip away
    setTimeout(() => {
      setCurrent(key);
      setPhase('in');                               // jump to other side
      requestAnimationFrame(() => requestAnimationFrame(() => setPhase('')));
    }, 250);
  };

  const confirm = (date) => {
    setBooked((b) => ({ ...b, [current]: date }));
    setModalOpen(false);
    setToast(`✓ ${ACTIVITIES[current].title} booked for ${fmtDate(date)}`);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 2500);
  };

  const item = ACTIVITIES[current];

  return (
    <>
      <div className="tabs" role="tablist">
        {Object.values(ACTIVITIES).map((a) => (
          <button
            key={a.key}
            className={`tab ${current === a.key ? 'active' : ''}`}
            onClick={() => switchTo(a.key)}
          >
            {a.title.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="layout">
        <div className={`flipper ${phase}`}>
          <BookingCard
            key={current}
            item={item}
            bookedDate={booked[current]}
            onChoose={() => setModalOpen(true)}
          />
        </div>
        <DetailsPanel current={current} booked={booked} onSelect={switchTo} />
      </div>

      <BookingModal
        open={modalOpen}
        item={item}
        initialDate={booked[current]}
        onClose={() => setModalOpen(false)}
        onConfirm={confirm}
      />

      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </>
  );
}
