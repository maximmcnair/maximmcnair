import { useState } from 'react';
import { getStroke } from 'perfect-freehand';
import { getSvgPathFromStroke } from '@/utils/getSvgPathFromStroke';
import styles from './Drawing.module.css';

const options = {
  size: 10,
  thinning: 0.1,
  smoothing: 0.1,
  streamline: 0.1
};

type Point = [number, number, number];
type Points = Point[];

function Drawing({points}: {points: Points}){
  const stroke = getStroke(points, options);
  const pathData = getSvgPathFromStroke(stroke);
  return(
    <svg
      className={styles.drawBg}
    >
      {points && <path d={pathData} fill="var(--color-blue-dark)" />}
    </svg>
  );
}

export default function Draw() {
  const [points, setPoints] = useState<Points>([]);
  const [drawings, setDrawings] = useState<Points[]>([]);

  function handlePointerUp(e: React.MouseEvent) {
    setDrawings(d => [...d, points])
    setPoints([]);
  }

  function handlePointerDown(e: React.MouseEvent) {
    // @ts-ignore
    e.target.setPointerCapture(e.pointerId);
    // @ts-ignore
    setPoints([[e.pageX, e.pageY, e.pressure]]);
  }

  function handlePointerMove(e: React.MouseEvent) {
    if (e.buttons !== 1) return;
    // @ts-ignore
    setPoints([...points, [e.pageX, e.pageY, e.pressure]]);
  }

  const stroke = getStroke(points, options);
  const pathData = getSvgPathFromStroke(stroke);

  return (
    <>
      {drawings.map((points, idx) =>
        <Drawing points={points} key={idx} />
      )}
      <svg
        className={styles.draw}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {points && <path d={pathData} fill="var(--color-blue-dark)" />}
      </svg>
    </>
  );
}
