'use client';

export default function Highlights({ matchId }: { matchId: string }) {
  return (
    <div className="glassmorphic p-4 rounded-xl">
      <h3 className="text-teal-200 font-semibold">Highlights</h3>
      <div className="w-full h-40 bg-gray-300 animate-pulse">Video for Match {matchId}</div>
    </div>
  );
}