import { useEffect, useState } from 'react';
import type { NextPage } from 'next';

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
    <div
      style={{
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
        fontSize: FONT_SIZE + 'px',
      }}
    >
      <label>
        <strong style={{ display: 'block' }}>Starting Value</strong>
        <input
          style={{ fontSize: FONT_SIZE + 'px' }}
          value={startingValue}
          type="number"
          onChange={evt => setStartingValue(parseFloat(evt.target.value))}
        />
      </label>
      <label>
        <strong style={{ display: 'block' }}>Ending Value</strong>
        <input
          style={{ fontSize: FONT_SIZE + 'px' }}
          value={endingValue}
          type="number"
          onChange={evt => setEndingValue(parseFloat(evt.target.value))}
        />
      </label>

      <strong style={{ display: 'block' }}>
        Percentage Change: {percentageChange === null || isNaN(percentageChange) ? '' : +percentageChange.toFixed(2)}%
      </strong>

      <strong style={{ display: 'block' }}>Multiplier: {multiplier === null || isNaN(multiplier) ? '' : +multiplier.toFixed(2)}x</strong>
    </div>
  );
};

export default LoreCalculator;
