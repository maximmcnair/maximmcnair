import { useState } from 'react';
import { getStroke } from 'perfect-freehand';
import { getSvgPathFromStroke } from "@/utils/getSvgPathFromStroke";
import styles from './Drawing.module.css'

const options = {
  size: 10,
  thinning: 0.1,
  smoothing: 0.1,
  streamline: 0.1,
};

const Drawing: React.FC = () => {
  const [points, setPoints] = useState([]);

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
    <svg
      className={styles.draw}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      style={{ touchAction: "none" }}
    >
      {points && <path d={pathData} />}
    </svg>
  );
}

export default Drawing;
