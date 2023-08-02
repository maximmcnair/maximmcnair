import { useEffect, useState } from 'react';
import ShaderView from '@/components/ShaderView';
// @ts-ignore
import frag0 from './dither/0-photos.glsl';
// @ts-ignore
import frag1 from './dither/1-threshold.glsl';
// @ts-ignore
import frag2 from './dither/2-threshold-steps.glsl';
// @ts-ignore
import frag3 from './dither/3-threshold-noise.glsl';
// @ts-ignore
import frag4 from './dither/4-dither-2x2.glsl';
// @ts-ignore
import frag5 from './dither/5-dither-4x4.glsl';
// @ts-ignore
import frag6 from './dither/6-dither-8x8.glsl';
// @ts-ignore
import frag7 from './dither/7-dither-cluster.glsl';
// @ts-ignore
import frag8 from './dither/8-dither-color.glsl';
// @ts-ignore
import frag9 from './dither/9-dither-duotone.glsl';

interface Props {
  step: string;
}

function setFrag(step: string) {
  switch (step) {
    case '0-photos':
      return frag0;
    case '1-threshold':
      return frag1;
    case '2-threshold-steps':
      return frag2;
    case '3-threshold-noise':
      return frag3;
    case '4-dither-2x2':
      return frag4;
    case '5-dither-4x4':
      return frag5;
    case '6-dither-8x8':
      return frag6;
    case '7-dither-cluster':
      return frag7;
    case '8-dither-color':
      return frag8;
    case '9-dither-duotone':
      return frag9;
    // default:
    //   return fragTest;
  }
}

const imgs = [
  '/flowers.jpg',
  '/brice-cooper-city.jpg',
  '/artem-sapegin-mountain.jpg',
  '/sawyer-bengtson-chicago-fog.jpg',
];

export function Dither(props: Props) {
  const frag = setFrag(props.step);
  const [imgIdx, setImgIdx] = useState(0);
  const [fx, setFx] = useState(1);
  const [fy, setFy] = useState(1);
  const [fz, setFz] = useState(1);

  useEffect(() => {
    if (props.step === '1-threshold') {
      setFx(0.3);
    }
    if (props.step === '2-threshold-steps') {
      setFx(0.4);
      setFy(0.2);
    }
    if (props.step === '3-threshold-noise') {
      setFx(0.4);
      setFy(0.2);
      setFz(0.9);
    }
  }, []);

  return (
    <div className="article-dither">
      <section className="article-dials">
        {props.step === '1-threshold' ? (
          <label>
            <strong>Threshold</strong>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={fx}
              onChange={evt => setFx(parseFloat(evt.target.value))}
            />
          </label>
        ) : null}

        {props.step === '2-threshold-steps' ? (
          <>
            <label>
              <strong>Threshold White</strong>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={fx}
                onChange={evt => setFx(parseFloat(evt.target.value))}
              />
            </label>
            <label>
              <strong>Threshold Grey</strong>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={fy}
                onChange={evt => setFy(parseFloat(evt.target.value))}
              />
            </label>
          </>
        ) : null}

        {props.step === '3-threshold-noise' ? (
          <>
            <label>
              <strong>Threshold White</strong>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={fx}
                onChange={evt => setFx(parseFloat(evt.target.value))}
              />
            </label>
            <label>
              <strong>Threshold Grey</strong>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={fy}
                onChange={evt => setFy(parseFloat(evt.target.value))}
              />
            </label>
            <label>
              <strong>Noise multipiler</strong>
              <input
                type="range"
                min={0}
                max={2}
                step={0.01}
                value={fz}
                onChange={evt => setFz(parseFloat(evt.target.value))}
              />
            </label>
          </>
        ) : null}
      </section>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '50px 0px',
        }}
        onClick={() => {
          setImgIdx(imgIdx < imgs.length - 1 ? imgIdx + 1 : 0);
        }}
      >
        <ShaderView
          title={''}
          width={520}
          height={500}
          // width={1200}
          // height={1200}
          frag={frag}
          imgSrc={imgs[imgIdx]}
          fx={fx}
          fy={fy}
          fz={fz}
        />
      </div>
    </div>
  );
}
