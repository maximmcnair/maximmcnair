import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import ShaderView from '@/components/ShaderView';
import { useControls } from 'leva';

// @ts-ignore
import frag from '@/components/WebGLFilters/dither/blend-modes.glsl';
// @ts-ignore
// import frag from '@/components/WebGLFilters/dither/matrix-color.glsl';

interface Props {}

const imgs = [
  '/matrix.png',
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
    <ShaderView
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
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
  );
};

export default Thumb;
