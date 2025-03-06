'use client';

import { useEffect } from 'react';

export default function Celebration({ type }: { type: string }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const element = document.querySelector('.celebrate');
      if (element) element.classList.remove('bounce');
    }, 3000);
    return () => clearTimeout(timer);
  }, [type]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className={`text-4xl text-amber-200 celebrate ${type === 'win' ? 'bounce' : ''}`}>
        🎉 {type}!
      </div>
    </div>
  );
}