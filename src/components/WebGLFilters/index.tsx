import { useEffect, useLayoutEffect, useRef, useState, useMemo } from 'react';

import { Config } from '@/experiments/2023-multi-pass/types';
import { loadImage } from '@/experiments/2023-multi-pass/utils';

import { Canvas, filters, Filter } from '@/experiments/2023-multi-pass/';

interface Props {
  step: string;
}

export function WebGLFilters({ step }: Props) {
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
    Duotone: 0,
    Blur: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<HTMLImageElement>();
  const [size, setSize] = useState({ width: 0, height: 0 });

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
  }, []);

  useLayoutEffect(() => {
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
    if (['Brightness', 'Exposure', 'Contrast', 'Saturation'].includes(step)){
      return filters.filter(f => f.key === step);
    }
    if (step === 'Article1') {
      return filters.filter(f => {
        return ['Brightness', 'Exposure', 'Contrast', 'Saturation'].includes(f.key)
      });
    }
    return [];
  }, [step]);

  return (
    <section className="article-webgl-photo-filters">
      <section className="article-webgl-photo-filters-dials">
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
