import { useEffect, useState } from 'react';

import ShaderView from '$/components/ShaderView';
// @ts-ignore
import frag from './dither/matrix-color.glsl';

const imgs = ['/matrix.png'];

interface Props { }

export function MatrixColor(props: Props) {
  // const frag = setFrag(frag);
  const [imgIdx, setImgIdx] = useState(0);
  const [size, setSize] = useState({ width: 602, height: 426 });
  const [fx, setFx] = useState(1);
  const [fy, setFy] = useState(1);
  const [fz, setFz] = useState(1);
  const [fw, setFw] = useState(1);

  // console.log(fx, fy, fz, fw);

  useEffect(() => { }, []);

  return (
    <div className="article-dither">
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
            frag={frag}
            imgSrc={imgs[imgIdx]}
            fx={fx}
            fy={fy}
            fz={fz}
            fw={fw}
          />
        )}
      </div>
    </div>
  );
}
