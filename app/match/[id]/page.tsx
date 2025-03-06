import { useState, useEffect } from 'react';
import MatchDetailContent from '@/components/MatchDetailContent'; // Adjust path as needed

interface Params {
  id: string;
}

interface MatchData {
  matchId: string;
  teams: string;
  score: string;
  crr: string;
  status: string;
  logos: { team1: string; team2: string };
  event?: string;
  commentary: string[];
  scorecard: {
    batting: { name: string; runs: string; balls: string; fours: string; sixes: string; sr: string }[];
    bowling: { name: string; overs: string; maidens: string; runs: string; wickets: string; noballs: string; wides: string; economy: string }[];
  };
  squads: { team1: string[]; team2: string[] };
}

// Explicitly define the props type to satisfy PageProps
export default function MatchPage({ params }: { params: Params }) {
  const { id } = params;
  const [matchData, setMatchData] = useState<MatchData | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data: MatchData) => setMatchData(data))
      .catch((err) => console.error('Fetch error:', err));
  }, [id]);

  if (!matchData) return <div className="text-center text-white text-xl">Loading...</div>;

  return (
    <div>
      <MatchDetailContent initialData={matchData} matchId={id} />
    </div>
  );
}