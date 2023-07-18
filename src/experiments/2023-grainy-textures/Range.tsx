import { useEffect, useRef, useMemo, useState, MouseEventHandler } from 'react';
import { mapLinear } from './utils';

interface Props {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (val: number) => void;
}

export function Range({ min, max, step, value, onChange }: Props) {
  const elRef = useRef<HTMLDivElement>(null);
  const [amount, setAmount] = useState(value);
  const [hasClicked, setHasClicked] = useState(false);

  useEffect(() => {
    setAmount(value);
  }, [value]);

  function getValue($el: DOMRect, clientX: number) {
    const { x, width } = $el;
    const start = x;
    const end = x + width;
    const value = mapLinear(clientX, start, end, min, max);
    return value;
  }

  function handleMouseDown(evt: any) {
    const $el = elRef.current?.getBoundingClientRect();
    if ($el) {
      setHasClicked(true);
      const val = getValue($el, evt.clientX);
      setAmount(val);
    }
  }

  const abc = useMemo(() => {
    const x = mapLinear(amount, min, max, 0, 100);
    return x;
  }, [min, max, amount]);

  useEffect(() => {
    function handleWindowMouseMove(evt: any) {
      const $el = elRef.current?.getBoundingClientRect();
      if ($el) {
        const val = getValue($el, evt.clientX);
        onChange(val);
      }
    }
    function handleMouseUp(evt: any) {
      setHasClicked(false);
      const $el = elRef.current?.getBoundingClientRect();
      if ($el) {
        const val = getValue($el, evt.clientX);
        setAmount(val);
        onChange(val);
      }
    }

    if (hasClicked) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [hasClicked, setHasClicked]);

  return (
    <div ref={elRef} onMouseDown={handleMouseDown} className="range">
      <div className="potential">
        <div className="amount" style={{ width: `${abc}%` }} />
      </div>
    </div>
  );
}
