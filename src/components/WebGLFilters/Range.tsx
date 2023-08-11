import { useEffect, useCallback, useRef, useMemo, useState } from 'react';
import { mapLinear, clamp } from './utils';

interface Props {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (val: number) => void;
}

export function Range({ min, max, value, onChange }: Props) {
  const elRef = useRef<HTMLDivElement>(null);
  const [amount, setAmount] = useState(value);
  const [hasClicked, setHasClicked] = useState(false);

  useEffect(() => {
    setAmount(value);
  }, [value]);

  const getValue = useCallback(
    ($el: DOMRect, clientX: number) => {
      const { x, width } = $el;
      const start = x;
      const end = x + width;
      const value = mapLinear(clientX, start, end, min, max);
      return clamp(value, min, max);
    },
    [min, max],
  );

  function handleMouseDown(evt: any) {
    const $el = elRef.current?.getBoundingClientRect();
    if ($el) {
      setHasClicked(true);
      const val = getValue($el, evt.clientX);
      setAmount(clamp(val, min, max));
    }
  }

  function handleTouchDown(evt: any) {
    const $el = elRef.current?.getBoundingClientRect();
    if ($el) {
      setHasClicked(true);
      const val = getValue($el, evt.changedTouches[0].clientX);
      setAmount(clamp(val, min, max));
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
    function handleWindowTouchMove(evt: any) {
      const $el = elRef.current?.getBoundingClientRect();
      if ($el) {
        const val = getValue($el, evt.changedTouches[0].clientX);
        onChange(val);
      }
    }
    function handleTouchEnd(evt: any) {
      setHasClicked(false);
      const $el = elRef.current?.getBoundingClientRect();
      if ($el) {
        const val = getValue($el, evt.changedTouches[0].clientX);
        setAmount(val);
        onChange(val);
      }
    }

    if (hasClicked) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleWindowTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleWindowTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [hasClicked, setHasClicked, getValue, onChange]);

  return (
    <div
      ref={elRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchDown}
      className="range"
    >
      <div className="potential">
        <div className="amount" style={{ width: `${abc}%` }} />
      </div>
    </div>
  );
}
