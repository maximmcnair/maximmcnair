// Briefly the algorithm works like this:
// EF (easiness factor) is a rating for how difficult the card is.
// Grade: (0-2) Set reps and interval to 0, keep current EF (repeat card today)
//        (3)   Set interval to 0, lower the EF, reps + 1 (repeat card today)
//        (4-5) Reps + 1, interval is calculated using EF, increasing in time.

// Spaced Repetition is an efficient learning system that attempts to quiz the
// user with flash cards at specific intervals for maximum memory retention.
// The quiz interval is determined by the (0-5) rating the user gives after seeing
// each card, and increases or decreases depending on difficulty.

// The algorithm implemented here is the SM-2 algorithm used in the SuperMemo-2
// software as well as the popular open source Anki software.
// The algorithm is described here: http://www.supermemo.com/english/ol/sm2.htm

export function sm2(
  ef: number = 0,
  reps: number = 0,
  interval: number = 0,
  nextReview: Date = new Date(),
  lastReview: Date = new Date(),
  grade: number
) {
  let oldEF = ef;
  let newEF = 0;
  let nextDate = new Date();

  if (grade < 3) {
    reps = 0;
    interval = 0;
  } else {
    newEF = oldEF + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    if (newEF < 1.3) {
      // 1.3 is the minimum EF
      ef = 1.3;
    } else {
      ef = newEF;
    }
    reps = reps + 1;
    switch (reps) {
      case 1:
        interval = 1;
        break;
      case 2:
        interval = 6;
        break;
      default:
        interval = Math.ceil((reps - 1) * ef);
        break;
    }
  }

  if (grade === 3) {
    interval = 0;
  }

  nextDate.setDate(new Date().getDate() + interval);
  nextReview = nextDate;
  lastReview = new Date();

  return {
    ef,
    reps,
    interval,
    nextReview,
    lastReview,
  };
}
