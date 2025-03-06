'use client';

import { useState } from 'react'; // Add useState import

interface MatchData {
  teams: string;
  score: string;
  event?: string;
  commentary?: string[]; // Optional commentary array from matchData
}

export default function FullCommentary({ matchData }: { matchData: MatchData }) {
  // Use matchData.commentary if available, otherwise fall back to static commentary
  const commentary = matchData.commentary || ['Ball 1: No run.', 'Ball 2: Four!', 'Ball 3: Wicket!'];
  const [page, setPage] = useState(1);
  const itemsPerPage = 2;

  // Calculate paginated commentary
  const paginatedCommentary = commentary.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Determine if buttons should be disabled
  const isPrevDisabled = page === 1;
  const isNextDisabled = page * itemsPerPage >= commentary.length;

  return (
    <div className="glassmorphic p-4 rounded-xl">
      <h3 className="text-teal-200 font-semibold">Commentary</h3>
      {paginatedCommentary.length === 0 ? (
        <p className="text-white">No commentary available.</p>
      ) : (
        paginatedCommentary.map((comment, i) => <p key={i} className="text-white">{comment}</p>)
      )}
      <div className="flex justify-between mt-2">
        <button
          onClick={() => setPage(page - 1)}
          disabled={isPrevDisabled}
          className="text-teal-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={isNextDisabled}
          className="text-teal-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
