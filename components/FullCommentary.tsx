'use client';

interface MatchData {
  commentary: string[];
}

export default function FullCommentary({ matchData }: { matchData: MatchData }) {
  return (
    <div className="text-white">
      <h3>Commentary</h3>
      <ul>{matchData.commentary.map((comment, i) => <li key={i}>{comment}</li>)}</ul>
    </div>
  );
}