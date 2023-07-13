import fs from 'fs';
import path from 'path';

const contentDirectory = path.join(process.cwd(), 'src/shaders');

export interface Shader {
  title: string;
  frag: string;
}

export async function getShaders(): Promise<Shader[]> {
  const slugs = fs.readdirSync(contentDirectory);
  return slugs.map(s => {
    const shaderPath = path.join(contentDirectory, s);
    const shaderSource = fs.readFileSync(shaderPath, {
      encoding: 'utf8',
      flag: 'r',
    });
    return {
      title: s.replace('.frag', ''),
      frag: shaderSource,
    };
  });
}
