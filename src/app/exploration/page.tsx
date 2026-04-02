import { Header } from "$/components/Header";
import { Layout } from "$/components/Layout";
import { Video } from "$/components/Video";

export default function Exploration() {
  return (
    <Layout>
      <Header />

      <section className="grid grid-cols-3 gap-4">
        <Video src="public-work" />
      </section>
    </Layout>
  );
}
