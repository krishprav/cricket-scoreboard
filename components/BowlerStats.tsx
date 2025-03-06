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
    <div className="text-white">
      <h3>Bowler Statistics</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>O</th><th>M</th><th>R</th><th>W</th><th>NB</th><th>WD</th><th>ECO</th>
          </tr>
        </thead>
        <tbody>
          {bowlers.map((bowler, i) => (
            <tr key={i}>
              <td>{bowler.name}</td><td>{bowler.overs}</td><td>{bowler.maidens}</td><td>{bowler.runs}</td><td>{bowler.wickets}</td><td>{bowler.noballs}</td><td>{bowler.wides}</td><td>{bowler.economy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}