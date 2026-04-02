import { Layout } from "$/components/Layout";
import { Header } from "$/components/Header";

export default function AboutPage() {
  return (
    <Layout>
      <Header />

      <section
        className="flex flex-col justify-center items-center"
        style={{ height: "calc(100vh - 160px)" }}
      >
        <section className="mx-auto max-w-[600px] flex flex-col gap-6 opacity-0 animate-fadein">
          <p
            className="opacity-0 animate-fadein font-semibold text-white/60 text-base/8"
            style={{ animationDelay: "0.2s" }}
          >
            I design and build interactive systems — combining design,
            engineering, spatial interfaces.
          </p>

          <p
            className="opacity-0 animate-fadein font-semibold text-white/60 text-base/8"
            style={{ animationDelay: "0.6s" }}
          >
            Alongside client work, I develop experimental tools and interfaces
            using WebGL and real-time graphics. For projects, collaborations or
            ideas,{" "}
            <a href="" className="text-white">
              get in touch
            </a>
            .
          </p>
        </section>
      </section>
    </Layout>
  );
}
