import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import styles from '@/styles/lore-calculator.module.css';

interface Props {}

const FONT_SIZE = 20;

const LoreCalculator: NextPage<Props> = () => {
  const [startingValue, setStartingValue] = useState(0);
  const [endingValue, setEndingValue] = useState(0);

  const [percentageChange, setPercentageChange] = useState<number | null>(null);
  const [multiplier, setMultiplier] = useState<number | null>(null);

  useEffect(() => {
    const change = ((endingValue - startingValue) / startingValue) * 100;
    setPercentageChange(change);

    if (change === null) return;

    if (change < 0) {
      setMultiplier(1 - Math.abs(change / 100));
    } else {
      setMultiplier(1 + change / 100);
    }
  }, [startingValue, endingValue]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.inputs}>
          <label>
            <strong style={{ display: 'block' }}>Starting Value</strong>
            <input
              value={startingValue}
              type="number"
              onChange={evt => setStartingValue(parseFloat(evt.target.value))}
            />
          </label>

          <label>
            <strong style={{ display: 'block' }}>Ending Value</strong>
            <input
              value={endingValue}
              type="number"
              onChange={evt => setEndingValue(parseFloat(evt.target.value))}
            />
          </label>
        </div>

        <strong style={{ display: 'block' }}>
          <small>Percentage Change</small>{' '}
          {percentageChange === null || isNaN(percentageChange)
            ? ''
            : +percentageChange.toFixed(2)}
          %
        </strong>

        <strong style={{ display: 'block' }}>
          <small>Multiplier</small>{' '}
          {multiplier === null || isNaN(multiplier)
            ? ''
            : +multiplier.toFixed(2)}
          x
        </strong>
      </div>
    </div>
  );
};

export default LoreCalculator;
