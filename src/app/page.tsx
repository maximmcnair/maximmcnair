import frag from "$/shaders/2023-07-18_01.frag";
import ShaderView from "$/components/ShaderView";
import { Video } from "$/components/Video";
import { ButtonLink } from "$/components/ButtonLink";
import { Image } from "$/components/Image";
import { AnimateTextBlur } from "$/components/AnimateTextBlur";
import { Header } from "$/components/Header";
import { Layout } from "$/components/Layout";

enum WorkType {
  Img,
  Vid,
}

interface WorkProps {
  type: WorkType
  title: string
  src: string
  desc: string
  href?: string
  role: string
}

// <img src={src} className="aspect-[2.5] w-full bg-zinc-900 overflow-hidden rounded-4xl border-0 outline-hidden" />

function Work({ type, title, src, href, desc, role }: WorkProps) {
  return (
    <section>
      <div className="w-full bg-zinc-900">
        {type === WorkType.Vid ?
          <Video src={src} className="overflow-hidden rounded-4xl" />
          :
          <Image src={src} alt={title} className="overflow-hidden rounded-4xl border-0 outline-hidden" />
        }
      </div>
      <section className="relative mt-4 flex flex-col gap-3">
        <h3 className="mt-1 text-xl font-medium">{title}</h3>
        <p className="max-w-[800px] md:pr-[200px] mb-2">
          {desc}
        </p>
        <div className="mb-2">
          <strong className="flex-inline py-[8px] pb-[9px] px-[15px] rounded-lg bg-zinc-800 text-white font-bold text-sm">{role}</strong>
        </div>
        {href && (
          <div className="md:absolute top-2 right-0">
            <ButtonLink href={href} text={title} />
          </div>
        )}
      </section>
    </section>

  )
}

export default function Home() {
  return (
    <Layout>
      <Header />

      <section
        id="about"
        className="relative overflow-hidden rounded-4xl aspect-square sm:aspect-[2.8] text-center mb-14 flex justify-center items-center bg-zinc-900 opacity-0 animate-fadein"
      >
        {/* <h1 className="text-white z-90 text-sm lg:text-xl font-medium"> */}
        {/*   Design Engineer.<br /> */}
        {/*   Currently building{" "} */}
        {/*   <a href="http://cosmos.so" className="border-b-2" target="_blank"> */}
        {/*     Cosmos */}
        {/*   </a> */}
        {/*   . */}
        {/* </h1> */}

        <div className="z-80">
          <AnimateTextBlur text="Design Engineer. Currently building Cosmos." delay={1.5} />
        </div>

        <ShaderView
          frag={frag}
          className="absolute top-0 left-0 w-full h-full z-10 animate-fadein"
        />
      </section>

      <section id="work" className="flex flex-col gap-[70px] sm:gap-[100px] mb-20 opacity-0 animate-fadein"
        style={{ animationDelay: '1.4s' }}>
        <Work
          type={WorkType.Vid}
          title="Cosmos"
          src="cosmos"
          desc="Software engineer at Cosmos, where I help build a discovery engine for creatives. At Cosmos, users can save inspiring content from across the web, organize discoveries into meaningful clusters, and share curated collections with the world."
          href="https://www.cosmos.so"
          role="Senior Software Engineer"
        />

        <Work
          type={WorkType.Vid}
          title="Public Work"
          src="public-work"
          desc="Result of a week long hack week at Cosmos. Public Work is a visual search engine for public domain content. Explore 100,000+ copyright-free images from The MET, New York Public Library, and other sources"
          href="https://www.public.work"
          role="Design Engineer"
        />

        <Work
          type={WorkType.Vid}
          title="Lumine"
          src="lumine"
          desc="WebGPU based image editor"
          role="Design Engineer"
        />

        <Work
          type={WorkType.Vid}
          title="Nmblr"
          src="nmblr"
          role="Lead Engineer"
          desc={`Nmblr is a real-time collaboration platform for research and
            discovery in pharma. I led the construction of this greenfield
            project with a focus on building an interactive and real-time app
            with drag-and-drop functionality throughout.`}
        />

        <Work
          type={WorkType.Img}
          title="BoilerRoom"
          src="/work_boilerroom.jpg"
          href="https://boilerroom.tv/"
          role="Mobile Engineer"
          desc={`Connecting club culture to the wider world, on screen and through parties, film and video.`}
        />


        {false && (
          <Work
            type={WorkType.Img}
            title="Bulb Energy"
            src="/work_boilerroom.jpg"
            role="Mobile Lead Engineer"
            desc={``}
          />
        )}

        <Work
          type={WorkType.Img}
          title="InMySize"
          src="/work_inmysize.jpg"
          role="Founder + Design Engineer"
          desc={`InMySize is a streetwear shopping app that shows users clothing from
            multiple stores that are currently in stock`}
        />
      </section>
    </Layout>
  );
}
