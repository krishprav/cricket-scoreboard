'use client';

interface Bowler {
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  noBalls: number;
  wides: number;
  economy: number;
}

export default function BowlerStats({ bowlers }: { bowlers: Bowler[] }) {
  return (
    <div className="glassmorphic p-4 rounded-xl mb-4">
      <h3 className="text-teal-200 font-semibold mb-2">Bowler Statistics</h3>
      <table className="w-full text-gray-100">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="text-left py-2">Name</th>
            <th className="text-right py-2">O</th>
            <th className="text-right py-2">M</th>
            <th className="text-right py-2">R</th>
            <th className="text-right py-2">W</th>
            <th className="text-right py-2">NB</th>
            <th className="text-right py-2">WD</th>
            <th className="text-right py-2">ECO</th>
          </tr>
        </thead>
        <tbody>
          {bowlers.map((bowler, index) => (
            <tr key={index} className="border-b border-gray-600">
              <td className="py-2">{bowler.name}</td>
              <td className="text-right py-2">{bowler.overs.toFixed(1)}</td>
              <td className="text-right py-2">{bowler.maidens}</td>
              <td className="text-right py-2">{bowler.runs}</td>
              <td className="text-right py-2">{bowler.wickets}</td>
              <td className="text-right py-2">{bowler.noBalls}</td>
              <td className="text-right py-2">{bowler.wides}</td>
              <td className="text-right py-2">{bowler.economy.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}