import { useEffect, useRef, useState, useMemo } from 'react';

import { Config } from './types';
import { loadImage, HEXtoRGBAVec4 } from './utils';
import { Canvas, filters, Filter } from './index';

const ranges = [
  ['#ffffff', '#000000'],
  ['#f43d1f', '#240851'],
  ['#fef445', '#f439b5'],
  ['#42ed0b', '#5e215c'],
  ['#d24b51', '#36455a'],
  ['#01bdac', '#00229d'],
];

interface Props {
  step: string;
}

export function Duotone({ step }: Props) {
  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const [config, setConfig] = useState<Config>({
    // View
    FOVAngle: 75,
    FOVRadius: 100,
    model: { x: 0, y: 0, z: 0 },
    camera: { x: 0, y: 0, z: 0.6 },

    // photo size
    'photo-x-top': 1,
    'photo-x-bottom': -1,
    'photo-y-right': 1,
    'photo-y-left': -1,

    zoom: 1.0,

    // filter
    Brightness: 0,
    Contrast: 0,
    Exposure: 0,
    Saturation: 0,
    Hue: 0,

    // effects
    Grain: 0,
    Pixelate: 0.001,
    Vignette: 0,
    Duotone: 1,
    Blur: 0,

    // duotone
    DuotoneHigh: HEXtoRGBAVec4(ranges[activeColorIdx][0]),
    DuotoneLow: HEXtoRGBAVec4(ranges[activeColorIdx][1]),
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<HTMLImageElement>();
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setConfig(c => ({
      ...c,
      DuotoneHigh: HEXtoRGBAVec4(ranges[activeColorIdx][0]),
      DuotoneLow: HEXtoRGBAVec4(ranges[activeColorIdx][1]),
    }));
  }, [activeColorIdx]);

  useEffect(() => {
    function updateColorIdx() {
      if (activeColorIdx < ranges.length - 1) {
        setActiveColorIdx(activeColorIdx + 1);
      } else {
        setActiveColorIdx(0);
      }
    }
    let id = setInterval(updateColorIdx, 2000);
    return () => clearInterval(id);
  }, [activeColorIdx, setActiveColorIdx]);

  useEffect(() => {
    async function loadImageAndSetSize() {
      const image = await loadImage('/flowers.jpg');
      const aspectRatio = image.width / image.height;
      setImage(image);
      // set aspect ratio
      const modelXOffset = Math.abs(1 - aspectRatio);
      setConfig(c => ({
        ...c,
        'photo-x-top': aspectRatio,
        model: {
          ...c.model,
          x: -(modelXOffset / 2),
        },
      }));
    }
    loadImageAndSetSize();

    if (!containerRef.current) return;
    function handleResize() {
      if (!containerRef.current) return;
      const { offsetWidth, offsetHeight } = containerRef.current;
      setSize({
        width: offsetWidth,
        height: offsetHeight,
      });
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // update filters
  const stepFilters: Filter[] = useMemo(() => {
    if (step === 'Intro') return [];
    if (
      [
        'Brightness',
        'Exposure',
        'Contrast',
        'Saturation',
        'Vignette',
        'Grain',
      ].includes(step)
    ) {
      return filters.filter(f => f.key === step);
    }
    if (step === 'Article1') {
      return filters.filter(f => {
        return ['Brightness', 'Exposure', 'Contrast', 'Saturation'].includes(
          f.key,
        );
      });
    }
    return [];
  }, [step]);

  return (
    <section className="article-webgl-photo-filters">
      <section className="article-webgl-photo-filters-dials">
        <div className="article__webgl__duotone-colors">
          {ranges.map((r, idx) => (
            <div
              key={idx}
              className={`article__webgl__duotone-range ${
                idx === activeColorIdx
                  ? 'article__webgl__duotone-range--active'
                  : ''
              }`}
              onClick={() => setActiveColorIdx(idx)}
            >
              <div
                className="article__webgl__duotone-color"
                style={{ backgroundColor: r[0] }}
              />
              <div
                className="article__webgl__duotone-color"
                style={{ backgroundColor: r[1] }}
              />
            </div>
          ))}
        </div>

        {stepFilters.map(f => (
          <Input
            key={f.key}
            f={f}
            // @ts-ignore
            value={config[f.key]}
            handleUpdate={val => {
              setConfig(c => ({
                ...c,
                [f.key]: val,
              }));
            }}
          />
        ))}
      </section>
      <section
        className="article-webgl-photo-filters-canvas"
        ref={containerRef}
      >
        {!!(image && size.width && size.height) && (
          <Canvas image={image} size={size} config={config} />
        )}
      </section>
    </section>
  );
}

interface PropsInput {
  f: Filter;
  value: number;
  handleUpdate: (val: number) => void;
}

function Input({ f, value, handleUpdate }: PropsInput) {
  return (
    <label>
      <strong>{f.name}</strong>
      <input
        min={f.min}
        max={f.max}
        type="range"
        step={f.step}
        value={value}
        onChange={evt => {
          const val = evt.target.value;
          handleUpdate(parseFloat(val));
        }}
      />
    </label>
  );
}
