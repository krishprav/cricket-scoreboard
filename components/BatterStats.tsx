'use client';

interface Batter {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
}

export default function BatterStats({ batters }: { batters: Batter[] }) {
  return (
    <div className="glassmorphic p-4 rounded-xl mb-4">
      <h3 className="text-teal-200 font-semibold mb-2">Batter Statistics</h3>
      <table className="w-full text-gray-100">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="text-left py-2">Name</th>
            <th className="text-right py-2">R</th>
            <th className="text-right py-2">B</th>
            <th className="text-right py-2">4s</th>
            <th className="text-right py-2">6s</th>
            <th className="text-right py-2">SR</th>
          </tr>
        </thead>
        <tbody>
          {batters.map((batter, index) => (
            <tr key={index} className="border-b border-gray-600">
              <td className="py-2">{batter.name}</td>
              <td className="text-right py-2">{batter.runs}</td>
              <td className="text-right py-2">{batter.balls}</td>
              <td className="text-right py-2">{batter.fours}</td>
              <td className="text-right py-2">{batter.sixes}</td>
              <td className="text-right py-2">{batter.strikeRate.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}