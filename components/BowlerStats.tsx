'use client';

interface Bowler {
  name: string;
  overs: string;
  maidens: string;
  runs: string;
  wickets: string;
  noballs: string;
  wides: string;
  economy: string;
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
          {bowlers.length > 0 ? (
            bowlers.map((bowler, index) => (
              <tr key={index} className="border-b border-gray-600">
                <td className="py-2">{bowler.name || 'N/A'}</td>
                <td className="text-right py-2">{bowler.overs || '0'}</td>
                <td className="text-right py-2">{bowler.maidens || '0'}</td>
                <td className="text-right py-2">{bowler.runs || '0'}</td>
                <td className="text-right py-2">{bowler.wickets || '0'}</td>
                <td className="text-right py-2">{bowler.noballs || '0'}</td>
                <td className="text-right py-2">{bowler.wides || '0'}</td>
                <td className="text-right py-2">{bowler.economy || '0.00'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="py-2 text-center text-gray-400">
                No bowler statistics available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}