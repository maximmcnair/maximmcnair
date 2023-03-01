import {useState,useEffect} from 'react';
import { Shaders, Node, GLSL } from "gl-react";
import { Surface } from "gl-react-dom";

import styles from './Background.module.css'

  // background-color: #332bcc;

const shaders = Shaders.create({
  helloBlue: {
    frag: GLSL`
precision highp float;
varying vec2 uv;
uniform float blue;
void main() {
  gl_FragColor = vec4(uv.x, uv.y, blue, 1.0);
}`
  }
});

function Background(){
  const [{width, height}, setSize] = useState({width: 0, height: 0});

  useEffect(() => {
    // set height&width of canvas 
    setSize({
      width: window.innerWidth,
      height: window.innerHeight
    })

    function onResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
      // if (window.devicePixelRatio > 1) {
      //   canvas.width = canvas.clientWidth * 2;
      //   canvas.height = canvas.clientHeight * 2;
      //   ctx.scale(2, 2);
      // } else {
      //   canvas.width = canvas.offsetWidth;
      //   canvas.height = canvas.offsetHeight;
      // }

      // ctx.globalCompositeOperation = 'saturation';
    }

    onResize();

    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className={styles.content}>
      <Surface width={width} height={height}>
        <Node shader={shaders.helloBlue} uniforms={{ blue: 0.5 }} />
      </Surface>
    </div>
  );
}

export default Background;
