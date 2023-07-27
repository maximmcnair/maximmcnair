import fs from 'fs';
import path from 'path';
import { Shader } from "@/types";

const contentDirectory = path.join(process.cwd(), 'src/shaders');

export async function getShaderSlugs(): Promise<string[]> {
  const slugs = fs.readdirSync(contentDirectory);
  return slugs.map((s) => s.replace(".frag", ""));
}

export async function getShader(slug: string): Promise<Shader> {
    const shaderPath = path.join(contentDirectory, `${slug}.frag`);
    const shaderSource = fs.readFileSync(shaderPath, {
      encoding: 'utf8',
      flag: 'r',
    });
    return {
      title: slug,
      frag: shaderSource,
    };
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
