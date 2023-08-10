import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import ShaderView from '@/components/ShaderView';

// @ts-ignore
import frag from '@/components/WebGLFilters/dither/vingette.glsl';
// import frag from '@/components/WebGLFilters/dither/chromatic-aberration.glsl';
// import frag from '@/components/WebGLFilters/dither/vingette-simple.glsl';
// import frag from '@/components/WebGLFilters/dither/hue.glsl';
// import frag from '@/components/WebGLFilters/dither/grayscale.glsl';
// import frag from '@/components/WebGLFilters/dither/pixelate.glsl';
// import frag from '@/components/WebGLFilters/dither/grain.glsl';
// import frag from '@/components/WebGLFilters/dither/duotone.glsl';
// import frag from '@/components/WebGLFilters/dither/3-threshold-noise.glsl';
// import frag from '@/components/WebGLFilters/dither/9-dither-duotone.glsl';

interface Props {}

const imgs = [
  '/flowers.jpg',
  '/brice-cooper-city.jpg',
  '/artem-sapegin-mountain.jpg',
  '/sawyer-bengtson-chicago-fog.jpg',
];

const Thumb: NextPage<Props> = () => {
  const [imgIdx, setImgIdx] = useState(0);
  const [fx, setFx] = useState(1);
  const [fy, setFy] = useState(1);
  const [fz, setFz] = useState(1);
  const [fw, setFw] = useState(1);

  useEffect(() => {
    // threshold
    // setFx(0.4);
    // setFy(0.2);
    // setFz(0.9);

    // vingette
    setFx(0.2);
    setFy(0.2);
    setFz(1.0);
    setFw(0.2);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ShaderView
        title={''}
        width={1200}
        height={1200}
        frag={frag}
        imgSrc={imgs[imgIdx]}
        fx={fx}
        fy={fy}
        fz={fz}
        fw={fw}
      />
    </div>
  );
};

export default Thumb;
