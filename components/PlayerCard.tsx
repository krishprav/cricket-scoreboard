'use client';

interface Player {
  name: string;
  team: string;
}

export default function PlayerCard({ player }: { player: Player }) {
  return (
    <div className="glassmorphic p-3 rounded-xl shadow-glass hover:shadow-neon transition-all duration-300 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
      <p className="text-gray-100 text-center">{player.name}</p>
      <p className="text-teal-300 text-center text-sm">{player.team}</p>
    </div>
  );
}