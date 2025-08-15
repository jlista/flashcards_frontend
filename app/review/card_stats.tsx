import Image from 'next/image';

import { DeckCard } from '../model/deck_card';

interface MasteryScaleProps {
  masteryLevel: number;
}
function MasteryScale(props: MasteryScaleProps) {
  if (props.masteryLevel == 0) {
    return <Image src="/progress_slider1.png" alt="level 1" width="75" height="35" priority />;
  }
  if (props.masteryLevel == 1) {
    return <Image src="/progress_slider2.png" alt="level 2" width="75" height="35" priority />;
  }
  if (props.masteryLevel == 2) {
    return <Image src="/progress_slider3.png" alt="level 3" width="75" height="35" priority />;
  }
  if (props.masteryLevel == 3) {
    return <Image src="/progress_slider4.png" alt="level 4" width="75" height="35" priority />;
  }
  if (props.masteryLevel == 4) {
    return <Image src="/progress_slider5.png" alt="level 5" width="75" height="35" priority />;
  }
}

interface DaysAgoProps {
  date: Date | null;
}
function DaysAgo(props: DaysAgoProps) {
  const today = new Date();
  let timeDeltaStr = '';
  if (props.date != null) {
    const datediff = today.getTime() - new Date(props.date).getTime();
    const daysAgo = Math.floor(datediff / (24 * 60 * 60 * 1000));
    const hoursAgo = Math.floor(datediff / (60 * 60 * 1000));
    const minutesAgo = Math.floor(datediff / (60 * 1000));
    if (daysAgo == 1) {
      timeDeltaStr = 'Yesterday';
    } else if (daysAgo > 1) {
      timeDeltaStr = daysAgo.toString() + ' days ago';
    } else if (hoursAgo == 1) {
      timeDeltaStr = '1 hour ago';
    } else if (hoursAgo > 1) {
      timeDeltaStr = hoursAgo.toString() + ' hours ago';
    } else if (minutesAgo <= 1) {
      timeDeltaStr = 'Just now';
    } else {
      timeDeltaStr = minutesAgo.toString() + ' minutes ago';
    }
  } else {
    timeDeltaStr = 'Never';
  }
  return <div>{timeDeltaStr}</div>;
}

export default function CardStats(props: { currentCard: DeckCard }) {
  return (
    <div className="text-neutral-400 text-sm antialiased place-self-end">
      <div>
        Mastery Level: <MasteryScale masteryLevel={props.currentCard.masteryLevel}></MasteryScale>
      </div>
      <div>Streak: {props.currentCard.streak}</div>
      <div>
        Last Correct: <DaysAgo date={props.currentCard.lastCorrect}></DaysAgo>
      </div>
    </div>
  );
}
