'use client';

interface MatchData {
  teams: string;
  score: string;
  event?: string;
}

export default function FullCommentary({ matchData }: { matchData: MatchData }) {
  const commentary = ['Ball 1: No run.', 'Ball 2: Four!', 'Ball 3: Wicket!'];
  const [page, setPage] = useState(1);
  const itemsPerPage = 2;

  const paginatedCommentary = commentary.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="glassmorphic p-4 rounded-xl">
      <h3 className="text-teal-200 font-semibold">Commentary</h3>
      {paginatedCommentary.map((comment, i) => <p key={i} className="text-white">{comment}</p>)}
      <div className="flex justify-between mt-2">
        <button onClick={() => setPage(page - 1)} disabled={page === 1} className="text-teal-200">Prev</button>
        <button onClick={() => setPage(page + 1)} disabled={page * itemsPerPage >= commentary.length} className="text-teal-200">Next</button>
      </div>
    </div>
  );
}