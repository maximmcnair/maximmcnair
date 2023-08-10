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
// @ts-ignore
import fragGradientDither from './dither/gradient-dither.glsl';
// @ts-ignore
import fragVingetteBasic from './dither/vingette-basic.glsl';
// @ts-ignore
import fragVingetteBasicWhite from './dither/vingette-basic-white.glsl';
// @ts-ignore
import fragVingetteSimple from './dither/vingette-simple.glsl';
// @ts-ignore
import fragVingetteSimpleWhite from './dither/vingette-simple-white.glsl';
// @ts-ignore
import fragVingette from './dither/vingette.glsl';
// @ts-ignore
import fragVingetteWhite from './dither/vingette-white.glsl';
// @ts-ignore
import fragHue from './dither/hue.glsl';
// @ts-ignore
import fragHueRange from './dither/hue-range.glsl';
// @ts-ignore
import fragGradientHSB from './dither/gradient-hsb.glsl';
// @ts-ignore
import fragGradientHSBRounded from './dither/gradient-hsb-rounded.glsl';
// @ts-ignore
import fragGradientDither2x2 from './dither/gradient-dither-2x2.glsl';
// @ts-ignore
import fragGrain from './dither/grain.glsl';
// @ts-ignore
import fragGrainNoise from './dither/grain-noise.glsl';
// @ts-ignore
import fragGrain3d from './dither/grain-3d.glsl';
// @ts-ignore
import fragGrain3dNoise from './dither/grain-3d-noise.glsl';
// @ts-ignore
import fragGrain3dBlend from './dither/grain-3d-blend.glsl';
// @ts-ignore
import fragPixelate from './dither/pixelate.glsl';
// @ts-ignore
import fragChromaticAberration from './dither/chromatic-aberration.glsl';
// @ts-ignore
import fragChromaticAberrationRed from './dither/chromatic-aberration-red.glsl';
// @ts-ignore
import fragChromaticAberrationBlue from './dither/chromatic-aberration-blue.glsl';

interface Props {
  step: string;
  label?: string;
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
    case 'dither-gradient':
      return fragGradientDither;
    case 'vingette-basic':
      return [fragVingetteBasic, fragVingetteBasicWhite];
    case 'vingette-simple':
      return [fragVingetteSimple, fragVingetteSimpleWhite];
    case 'vingette':
      return [fragVingette, fragVingetteWhite];
    case 'hue':
      return fragHue;
    case 'hue-range':
      return fragHueRange;
    case 'gradient-hsb':
      return fragGradientHSB;
    case 'gradient-hsb-rounded':
      return fragGradientHSBRounded;
    case 'gradient-dither-2x2':
      return fragGradientDither2x2;
    case 'grain':
      return fragGrain;
    case 'grain-noise':
      return fragGrainNoise;
    case 'grain-3d-noise':
      return fragGrain3dNoise;
    case 'grain-3d':
      return fragGrain3d;
    case 'grain-3d-blend':
      return fragGrain3dBlend;
    case 'pixelate':
      return fragPixelate;
    case 'chromatic-aberration':
      return fragChromaticAberration;
    case 'chromatic-aberration-red':
      return fragChromaticAberrationRed;
    case 'chromatic-aberration-blue':
      return fragChromaticAberrationBlue;
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

const hueColors = [
  { title: 'Red', min: 0, max: (1 / 6) * 1 },
  { title: 'Yellow', min: (1 / 6) * 1, max: (1 / 6) * 2 },
  { title: 'Green', min: (1 / 6) * 2, max: (1 / 6) * 3 },
  { title: 'Cyan', min: (1 / 6) * 3, max: (1 / 6) * 4 },
  { title: 'Blue', min: (1 / 6) * 4, max: (1 / 6) * 5 },
  { title: 'Magenta', min: (1 / 6) * 5, max: (1 / 6) * 6 },
];

export function Dither(props: Props) {
  const frag = setFrag(props.step);
  const [imgIdx, setImgIdx] = useState(0);
  const [size, setSize] = useState({ width: 520, height: 500 });
  const [fx, setFx] = useState(1);
  const [fy, setFy] = useState(1);
  const [fz, setFz] = useState(1);
  const [fw, setFw] = useState(1);

  console.log(fx, fy, fz, fw);
  // console.log(props.label);

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
    if (props.step === 'dither-gradient') {
      // TODO
    }
    if (props.step === 'vingette-basic' || props.step === 'vingette-dist') {
      setImgIdx(2);
      setFx(0.8);
    }
    if (props.step === 'vingette-simple') {
      setImgIdx(2);
      setFx(0.5);
      setFy(0.1);
    }
    if (props.step === 'vingette') {
      setImgIdx(2);
      setFx(0.26);
      setFy(0.14);
      setFz(0);
      setFw(0.2);
    }
    if (props.step === 'hue') {
      setFx(0.4);
    }
    if (props.step === 'hue-range') {
      setFx(0.66);
      setFy(0);
      setFz((1 / 6) * 1);
    }
    if (props.step === 'grain') {
      setFx(0.2);
    }
    if (props.step === 'grain-3d-noise') {
      setFx(0.2);
    }
    if (props.step === 'grain-3d') {
      setFx(0.4);
      setFy(0.1);
    }
    if (props.step === 'grain-3d-blend') {
      setFx(0.4);
      setFy(0.1);
    }
    if (props.step === 'grain-3d-blend') {
      setFx(0.4);
    }
    if (
      ['gradient-hsb', 'gradient-hsb-rounded', 'gradient-dither-2x2'].includes(
        props.step,
      )
    ) {
      setSize(s => ({ ...s, height: 50 }));
    }
    if (props.step === 'pixelate') {
      setFx(60);
    }
    if (
      props.step === 'chromatic-aberration-red' ||
      props.step === 'chromatic-aberration-blue'
    ) {
      setFx(0.05);
      setFy(0.05);
    }
    if (props.step === 'chromatic-aberration') {
      setFx(0);
      setFy(0);
      setFz(0);
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

        {props.step === 'vingette-basic' ? (
          <>
            <label>
              <strong>Radius</strong>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={fx}
                onChange={evt => setFx(parseFloat(evt.target.value))}
              />
            </label>
          </>
        ) : null}

        {props.step === 'vingette-simple' ? (
          <>
            <label>
              <strong>Radius</strong>
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
              <strong>Smoothness</strong>
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

        {props.step === 'vingette' ? (
          <>
            <label>
              <strong>Roundness</strong>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={fz}
                onChange={evt => setFz(parseFloat(evt.target.value))}
              />
            </label>
            <label>
              <strong>Smoothness</strong>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={fw}
                onChange={evt => setFw(parseFloat(evt.target.value))}
              />
            </label>
            <label>
              <strong>Width</strong>
              <input
                type="range"
                min={0}
                max={0.5}
                step={0.01}
                value={fx}
                onChange={evt => setFx(parseFloat(evt.target.value))}
              />
            </label>
            <label>
              <strong>Height</strong>
              <input
                type="range"
                min={0}
                max={0.5}
                step={0.01}
                value={fy}
                onChange={evt => setFy(parseFloat(evt.target.value))}
              />
            </label>
          </>
        ) : null}

        {props.step === 'hue' ? (
          <>
            <label>
              <strong>Shift Hue</strong>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={fx}
                onChange={evt => setFx(parseFloat(evt.target.value))}
              />
            </label>
          </>
        ) : null}

        {props.step === 'hue-range' ? (
          <>
            <div style={{ display: 'flex', gap: 10 }}>
              {hueColors.map(({ title, min, max }, idx) => (
                <div
                  key={idx}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 2,
                    display: 'block',
                    backgroundColor: `hsl(${idx * 60}deg 100% 50%)`,
                    border: `3px solid hsl(${idx * 60}deg 100% ${
                      min === fy ? 50 : 0
                    }%)`,
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setFy(min);
                    setFz(max);
                  }}
                />
              ))}
            </div>
            <label>
              <strong>Shift Hue</strong>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={fx}
                onChange={evt => setFx(parseFloat(evt.target.value))}
              />
            </label>
          </>
        ) : null}

        {props.step === 'grain' ? (
          <>
            <label>
              <strong>Grain Mix</strong>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={fx}
                onChange={evt => setFx(parseFloat(evt.target.value))}
              />
            </label>
          </>
        ) : null}

        {props.step === 'grain-3d-noise' ? (
          <>
            <label>
              <strong>Grain Size</strong>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={fx}
                onChange={evt => setFx(parseFloat(evt.target.value))}
              />
            </label>
          </>
        ) : null}

        {props.step === 'grain-3d' ? (
          <>
            <label>
              <strong>Grain Size</strong>
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
              <strong>Grain Mix</strong>
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

        {props.step === 'grain-3d-blend' ? (
          <>
            <label>
              <strong>Grain Size</strong>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={fx}
                onChange={evt => setFx(parseFloat(evt.target.value))}
              />
            </label>
          </>
        ) : null}

        {props.step === 'pixelate' ? (
          <>
            <label>
              <strong>Pixelate size</strong>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={fx}
                onChange={evt => setFx(parseFloat(evt.target.value))}
              />
            </label>
          </>
        ) : null}

        {props.step === 'chromatic-aberration-red' ? (
          <>
            <label>
              <strong>Red X offset</strong>
              <input
                type="range"
                min={-1}
                max={1}
                step={0.1}
                value={fx}
                onChange={evt => setFx(parseFloat(evt.target.value))}
              />
            </label>
            <label>
              <strong>Red Y offset</strong>
              <input
                type="range"
                min={-1}
                max={1}
                step={0.1}
                value={fy}
                onChange={evt => setFy(parseFloat(evt.target.value))}
              />
            </label>
          </>
        ) : null}

        {props.step === 'chromatic-aberration-blue' ? (
          <>
            <label>
              <strong>Blue X offset</strong>
              <input
                type="range"
                min={-1}
                max={1}
                step={0.1}
                value={fx}
                onChange={evt => setFx(parseFloat(evt.target.value))}
              />
            </label>
            <label>
              <strong>Blue Y offset</strong>
              <input
                type="range"
                min={-1}
                max={1}
                step={0.1}
                value={fy}
                onChange={evt => setFy(parseFloat(evt.target.value))}
              />
            </label>
          </>
        ) : null}

        {props.step === 'chromatic-aberration' ? (
          <>
            <label>
              <strong>Red offset multipiler</strong>
              <input
                type="range"
                min={-1}
                max={1}
                step={0.1}
                value={fx}
                onChange={evt => setFx(parseFloat(evt.target.value))}
              />
            </label>
            <label>
              <strong>Green offset multipiler</strong>
              <input
                type="range"
                min={-1}
                max={1}
                step={0.1}
                value={fy}
                onChange={evt => setFy(parseFloat(evt.target.value))}
              />
            </label>
            <label>
              <strong>Blue offset multipiler</strong>
              <input
                type="range"
                min={-1}
                max={1}
                step={0.1}
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
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '50px 0px',
        }}
        onClick={() => {
          setImgIdx(imgIdx < imgs.length - 1 ? imgIdx + 1 : 0);
        }}
      >
        {Array.isArray(frag) ? (
          <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
            {frag.map((frag, idx) => (
              <ShaderView
                key={idx}
                title={''}
                width={size.width / 2}
                height={size.height / 2}
                // width={520}
                // height={500}
                // width={1200}
                // height={1200}
                frag={frag}
                imgSrc={imgs[imgIdx]}
                fx={fx}
                fy={fy}
                fz={fz}
                fw={fw}
              />
            ))}
          </div>
        ) : (
          <ShaderView
            title={''}
            width={size.width}
            height={size.height}
            // width={520}
            // height={500}
            // width={1200}
            // height={1200}
            frag={frag}
            imgSrc={imgs[imgIdx]}
            fx={fx}
            fy={fy}
            fz={fz}
            fw={fw}
          />
        )}
        {props.label ? (
          <span style={{ marginTop: 5 }}>{props.label}</span>
        ) : null}
      </div>
    </div>
  );
}
