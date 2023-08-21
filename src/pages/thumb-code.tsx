import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import ShaderView from '@/components/ShaderView';
import { useControls } from 'leva';
import Highlight from 'react-highlight';

// @ts-ignore
// import frag from '@/components/WebGLFilters/dither/convolution-sobel-hori.glsl';
// import frag from '@/components/WebGLFilters/dither/melting.glsl';
// import frag from '@/components/WebGLFilters/dither/blend-modes.glsl';
// @ts-ignore
import frag from '@/components/WebGLFilters/dither/matrix-color.glsl';

interface Props {}

const imgs = [
  '/matrix.png',
  // '/melting.png',
  '/flowers.jpg',
  '/brice-cooper-city.jpg',
  '/artem-sapegin-mountain.jpg',
  '/sawyer-bengtson-chicago-fog.jpg',
];

const Thumb: NextPage<Props> = () => {
  const [imgIdx, setImgIdx] = useState(0);
  // const [fx, setFx] = useState(1);
  // const [fy, setFy] = useState(1);
  // const [fz, setFz] = useState(1);
  // const [fw, setFw] = useState(1);
  // useEffect(() => {
  //   // threshold
  //   // setFx(0.4);
  //   // setFy(0.2);
  //   // setFz(0.9);
  //
  //   // vignette
  //   setFx(0.2);
  //   setFy(0.2);
  //   setFz(1.0);
  //   setFw(0.2);
  // }, []);

  const { fx, fy, fz, fw } = useControls({
    fx: {
      value: 1,
      min: 0,
      max: 1,
      step: 1,
    },
    fy: {
      value: 1,
      min: 0,
      max: 1,
      step: 1,
    },
    fz: {
      value: 1,
      min: 0,
      max: 1,
      step: 1,
    },
    fw: {
      value: 1,
      min: 0,
      max: 1,
      step: 1,
    },
  });

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div style={{ width: 602, fontSize: 18 }}>
          <Highlight>{`outColor = vec4(
  pow(texel.r, 3.0 / 2.0), 
  pow(texel.g, 4.0 / 5.0), 
  pow(texel.b, 3.0 / 2.0), 
  1.0
);`}</Highlight>
          <ShaderView
            title={''}
            // width={1200}
            // height={1200}
            width={602}
            height={426}
            mouse
            frag={frag}
            imgSrc={imgs[imgIdx]}
            fx={fx}
            fy={fy}
            fz={fz}
            fw={fw}
          />
        </div>
      </div>
    </>
  );
};

export default Thumb;
