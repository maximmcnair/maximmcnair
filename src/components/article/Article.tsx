import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { isMobile } from 'react-device-detect';

import { Post } from '$/types';
import ShaderView from '$/components/ShaderView';
import styles from './Articles.module.css';

// @ts-ignore
import fragBasic from '$/components/article/WebGLFilters/dither/basic.glsl';
// @ts-ignore
import fragColorCorrection from '$/components/article/WebGLFilters/dither/color-correction-preview.glsl';
// @ts-ignore
import fragHue from '$/components/article/WebGLFilters/dither/hue-preview.glsl';
// @ts-ignore
import fragFilmGrain from '$/components/article/WebGLFilters/dither/grain-preview.glsl';
// @ts-ignore
import fragDuotone from '$/components/article/WebGLFilters/dither/duotone-preview.glsl';
// @ts-ignore
import fragPixelate from '$/components/article/WebGLFilters/dither/pixelate-preview.glsl';
// @ts-ignore
import fragThresholding from '$/components/article/WebGLFilters/dither/threshold-preview.glsl';
// @ts-ignore
import fragDithering from '$/components/article/WebGLFilters/dither/dither-preview.glsl';
// @ts-ignore
import fragVignette from '$/components/article/WebGLFilters/dither/vignette-preview.glsl';
// @ts-ignore
import fragChromaticAberration from '$/components/article/WebGLFilters/dither/chromatic-aberration-preview.glsl';

interface Props {
  article: Post;
  style: React.CSSProperties;
}

const perspective = '1000px';
const delta = 20;
const imgSrc = '/flowers.jpg';

export const Article: React.FC<Props> = ({
  article: { slug, meta },
  style,
}) => {
  const refArticle = useRef<HTMLAnchorElement>(null);

  // function handleMouseMove(evt: MouseEvent<HTMLAnchorElement>) {
  //   if (!refArticle?.current) return;
  //   const { offsetWidth: width, offsetHeight: height } = refArticle.current;
  //   const box = refArticle.current?.getBoundingClientRect();
  //   const docElem = document.documentElement;
  //
  //   const top = box.top + window.pageYOffset - docElem.clientTop;
  //   const centerY = (height / 2) - (evt.pageY - top);
  //
  //   const left = box.left + window.pageXOffset - docElem.clientLeft;
  //   const centerX = (width / 2) - (evt.pageX - left);
  //
  //   refArticle.current.style.transform = `perspective(${perspective}) rotateX(${centerY / delta}deg) rotateY(${-(centerX / delta)}deg)`;
  // }

  // function handleMouseLeave() {
  //   if (!refArticle?.current) return;
  //   refArticle.current.style.transform = '';
  // }

  function slugToShaderPreview(slug: string) {
    switch (slug) {
      case 'webgl-color-correction':
        return fragColorCorrection;
      case 'webgl-hue':
        return fragHue;
      case 'webgl-pixelate':
        return fragPixelate;
      case 'webgl-thresholding':
        return fragThresholding;
      case 'webgl-dithering':
        return fragDithering;
      case 'webgl-vignette':
        return fragVignette;
      case 'webgl-chromatic-aberration':
        return fragChromaticAberration;
      case 'webgl-film-grain':
        return fragFilmGrain;
      case 'webgl-duotone':
        return fragDuotone;
      default:
        return fragBasic;
    }
  }

  const frag = slugToShaderPreview(slug);

  // TODO check GPU support
  return (
    <a
      href={`/p/${slug}`}
      ref={refArticle}
      className={styles.article}
      style={style}
    >
      <span className={styles.title}>{meta.title}</span>
      <span className={styles.issue}>{meta.issue}</span>
      <span className={styles.visit}>
        <ArrowUpRight size={20} />
        Read
      </span>
      {!isMobile ? (
        <ShaderView
          title={''}
          frag={frag}
          imgSrc={imgSrc}
          fx={0.4}
          fy={0.6}
          fz={0.5}
          fw={1}
        />
      ) : (
        <img className={styles.image} src={meta.thumb} />
      )}
    </a>
  );
};
