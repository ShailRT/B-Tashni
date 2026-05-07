import React, { useState, useRef, useEffect } from 'react';

export default function SizeGuidePopup({ isOpen, onClose }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hasPositioned, setHasPositioned] = useState(false);
  const [unit, setUnit] = useState('IN'); // 'IN' or 'CM'
  const popupRef = useRef(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Initialize position to bottom-right corner when opened
  useEffect(() => {
    if (isOpen && popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect();
      const x = window.innerWidth - rect.width - 24; // 24px from right edge
      const y = window.innerHeight - rect.height - 24; // 24px from bottom edge
      setPosition({ x, y });
      setHasPositioned(true);
    } else {
      setHasPositioned(false);
    }
  }, [isOpen]);

  const handlePointerDown = (e) => {
    if (e.target.closest('.no-drag')) return;
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    document.body.style.userSelect = 'none'; // Prevent text selection
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    
    let newX = e.clientX - dragStart.current.x;
    let newY = e.clientY - dragStart.current.y;

    // Keep inside viewport boundaries
    if (popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect();
      newX = Math.max(0, Math.min(newX, window.innerWidth - rect.width));
      newY = Math.max(0, Math.min(newY, window.innerHeight - rect.height));
    }

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      document.body.style.userSelect = '';
    };
  }, [isOpen, position]);

  if (!isOpen) return null;

  const data = [
    { size: 'XXXS', chest: 39, shoulder: 19.5, length: 26.5 },
    { size: 'XXS', chest: 42, shoulder: 20, length: 28 },
    { size: 'XS', chest: 44, shoulder: 20.5, length: 28.5 },
    { size: 'S', chest: 46, shoulder: 21, length: 29 },
    { size: 'M', chest: 48, shoulder: 21.5, length: 29.5 },
    { size: 'L', chest: 50, shoulder: 22, length: 30 },
    { size: 'XL', chest: 52, shoulder: 24.5, length: 30 },
    { size: 'XXL', chest: 54, shoulder: 25, length: 30.5 },
    { size: 'XXXL', chest: 56, shoulder: 25.75, length: 31 },
  ];

  const convert = (val) => {
    if (unit === 'CM') {
      return (val * 2.54).toFixed(1);
    }
    return val;
  };

  return (
    <div
      ref={popupRef}
      onPointerDown={handlePointerDown}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: 'none',
        zIndex: 9999,
        opacity: hasPositioned ? 1 : 0,
        transition: 'opacity 0.2s ease-in-out'
      }}
      className="w-[340px] md:w-[420px] bg-[#f0f0f0] rounded-2xl shadow-2xl flex flex-col cursor-grab active:cursor-grabbing p-5 border border-white/40 backdrop-blur-md"
    >
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-[18px] font-bold text-[#111] tracking-wide">Size guide</h2>
        <div className="flex items-center gap-3 no-drag">
          <div className="flex bg-white rounded-full p-1 shadow-sm">
            <button
              onClick={() => setUnit('IN')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${unit === 'IN' ? 'bg-[#f0f0f0] text-black shadow-sm' : 'text-gray-400 hover:text-black'}`}
            >
              IN
            </button>
            <button
              onClick={() => setUnit('CM')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${unit === 'CM' ? 'bg-[#f0f0f0] text-black shadow-sm' : 'text-gray-400 hover:text-black'}`}
            >
              CM
            </button>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-gray-200 transition-colors text-gray-500 hover:text-black bg-white shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[14px] overflow-hidden border border-gray-100 shadow-sm no-drag">
        <table className="w-full text-center text-[13px] text-[#666]">
          <thead>
            <tr className="border-b border-gray-100 bg-white">
              <th className="py-3.5 font-bold text-[#333] w-1/4">Size</th>
              <th className="py-3.5 font-bold text-[#333] w-1/4 border-l border-gray-100">Chest</th>
              <th className="py-3.5 font-bold text-[#333] w-1/4 border-l border-gray-100">Shoulder</th>
              <th className="py-3.5 font-bold text-[#333] w-1/4 border-l border-gray-100">Length</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={row.size} className={idx !== data.length - 1 ? 'border-b border-gray-100' : ''}>
                <td className="py-3 font-medium text-[#444]">{row.size}</td>
                <td className="py-3 border-l border-gray-100">{convert(row.chest)}</td>
                <td className="py-3 border-l border-gray-100">{convert(row.shoulder)}</td>
                <td className="py-3 border-l border-gray-100">{convert(row.length)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
