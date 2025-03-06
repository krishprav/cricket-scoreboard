'use client';

export default function PointsTable() {
  const teams = [
    { name: 'Wellington', points: 12 },
    { name: 'Otago', points: 8 },
  ];

  return (
    <div className="glassmorphic p-4 rounded-xl">
      <h3 className="text-teal-200 font-semibold">Points Table</h3>
      {teams.map((team, index) => (
        <p key={index} className="text-white">{team.name}: {team.points}</p>
      ))}
    </div>
  );
}