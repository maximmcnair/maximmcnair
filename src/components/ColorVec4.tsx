import { useState } from 'react';
import { mapLinear, clamp } from './WebGLFilters/utils';

interface Props {
  color: [number, number, number, number];
}

function mapCssToGlsl(val: number): number {
  return mapLinear(val, 0, 255, 0, 1);
}

function mapGlslToCss(val: number): number {
  return mapLinear(val, 0, 1, 0, 255);
}

export function ColorVec4(props: Props) {
  const [r, setR] = useState(props.color[0]);
  const [g, setG] = useState(props.color[1]);
  const [b, setB] = useState(props.color[2]);
  const [a, setA] = useState(props.color[3]);

function handleGLSLChange(val: string){
  const num = parseFloat(val); 
  return mapGlslToCss(clamp(num, 0, 1));
  }

  return (
    <div className="color-vec4">
      <section
        className="color-vec4__color"
        style={{
          backgroundColor: `rgba(${r}, ${g}, ${b}, ${a})`,
        }}
      />
      <section className="color-vec4__picker">
        <div className="color-vec4__picker_value">
          <strong>GLSL Vec4 (0 to 1)</strong>
          <span>
            vec4(
            <input
              value={mapCssToGlsl(r).toFixed(1)}
              type="number"
              min="0"
              max="1"
              step="0.1"
              onChange={evt =>
                setR(handleGLSLChange(evt.target.value))
              }
            />
            ,
            <input
              value={mapCssToGlsl(g).toFixed(1)}
              type="number"
              min={0}
              max={1}
              step={0.1}
              onChange={evt =>
                setG(handleGLSLChange(evt.target.value))
              }
            />
            ,
            <input
              value={mapCssToGlsl(b).toFixed(1)}
              type="number"
              min={0}
              max={1}
              step={0.1}
              onChange={evt =>
                setB(handleGLSLChange(evt.target.value))
              }
            />
            ,
            <input
              value={mapCssToGlsl(a).toFixed(1)}
              type="number"
              min={0}
              max={1}
              step={0.1}
              onChange={evt =>
                setA(handleGLSLChange(evt.target.value))
              }
            />
            , )
          </span>
        </div>

        <div>
          <strong>CSS rgba (0 to 255)</strong>
          <span>
            rgba(
            <input
              value={r}
              type="number"
              min={0}
              max={255}
              step={1}
              onChange={evt =>
                setR(clamp(parseFloat(evt.target.value), 0, 255))
              }
            />
            ,
            <input
              value={g}
              type="number"
              min={0}
              max={255}
              step={1}
              onChange={evt =>
                setG(clamp(parseFloat(evt.target.value), 0, 255))
              }
            />
            ,
            <input
              value={b}
              type="number"
              min={0}
              max={255}
              step={1}
              onChange={evt =>
                setB(clamp(parseFloat(evt.target.value), 0, 255))
              }
            />
            ,
            <input
              value={a}
              type="number"
              min={0}
              max={255}
              step={1}
              onChange={evt =>
                setA(clamp(parseFloat(evt.target.value), 0, 255))
              }
            />
            )
          </span>
        </div>
      </section>
    </div>
  );
}
