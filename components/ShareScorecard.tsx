// components/ShareScorecard.tsx
'use client';

interface MatchData {
  teams: string;
  score: string;
}

interface ShareScorecardProps {
  matchData: MatchData;
}

export default function ShareScorecard({ matchData }: ShareScorecardProps) {
  const shareText = `${matchData.teams} - ${matchData.score || 'Live Score'} #CricketBlitz`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const shareOnTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  const shareOnFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  const shareOnWhatsApp = () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
  const shareOnInstagram = () => window.open(`https://www.instagram.com/create/story/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  const shareOnLinkedIn = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  const shareOnTelegram = () => window.open(`https://telegram.me/share/url?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');

  return (
    <div className="flex justify-center gap-4 flex-wrap">
      <button onClick={shareOnTwitter} className="px-4 py-2 bg-button-gradient text-navy rounded-lg hover:shadow-neon transition font-sport">Twitter</button>
      <button onClick={shareOnFacebook} className="px-4 py-2 bg-button-gradient text-navy rounded-lg hover:shadow-neon transition font-sport">Facebook</button>
      <button onClick={shareOnWhatsApp} className="px-4 py-2 bg-button-gradient text-navy rounded-lg hover:shadow-neon transition font-sport">WhatsApp</button>
      <button onClick={shareOnInstagram} className="px-4 py-2 bg-button-gradient text-navy rounded-lg hover:shadow-neon transition font-sport">Instagram</button>
      <button onClick={shareOnLinkedIn} className="px-4 py-2 bg-button-gradient text-navy rounded-lg hover:shadow-neon transition font-sport">LinkedIn</button>
      <button onClick={shareOnTelegram} className="px-4 py-2 bg-button-gradient text-navy rounded-lg hover:shadow-neon transition font-sport">Telegram</button>
    </div>
  );
}