'use client';

interface MatchData {
  commentary: string[];
}

export default function FullCommentary({ matchData }: { matchData: MatchData }) {
  return (
    <div className="glassmorphic p-4 rounded-xl mb-4">
      <h3 className="text-teal-200 font-semibold mb-2">Commentary</h3>
      {matchData.commentary && matchData.commentary.length > 0 ? (
        <ul className="space-y-2 text-gray-100">
          {matchData.commentary.map((comment, i) => (
            <li key={i} className="border-b border-gray-700 pb-2">{comment}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No commentary available for this match.</p>
      )}
    </div>
  );
}