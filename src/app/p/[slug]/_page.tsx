export default function Post() {
  return (
    <div className="mx-auto px-6 mt-6 max-w-[1200px]">
      <header id="header" className="mb-5">
        <span>Maxim McNair</span>

        <nav>
          <a href="#work">Work</a>
          <a href="/bookshelf">Bookshelf</a>
        </nav>
      </header>

      <section className="flex items-center justify-center">
        <article className="mx-auto w-full max-w-2xl text-left">
          <header className="mt-14 mb-4">
            <h1 className="bg-black-800 text-2xl">
              Miami to Bahamas on Jet Skis (280 miles)
            </h1>
            <time dateTime="01 01 1860" className="hidden text-gray-400">
              <span className="">1 Jan 1860</span>
            </time>
          </header>

          <div className="flex flex-col gap-6 text-gray-500">
            <p>
              Most friendships start with normal conversations about sports or
              music or video games. Mine with Drew started sophomore year in
              Wood Shop with him explaining, in elaborate detail, why riding jet
              skis to the Bahamas was totally possible and definitely not
              suicidal.
            </p>

            <img className="block h-[400px] w-full rounded-4xl bg-gray-400" />

            <p>
              The Gulf Stream moves with the kind of indifference you'd expect
              from something that's been carving its way between Florida and the
              Bahamas since before humans dreamed of crossing it. Most rational
              people make this journey in proper boats - vessels with actual
              cabins and enough safety equipment to rescue the titanic. But
              there's always that particular breed of adventurer who looks at
              fifty miles of open ocean and thinks: "Yeah, I could probably do
              that on a jet ski".
            </p>

            <p>
              Looking back, I should've known better. But after years of
              friendship and a surprisingly profitable landscaping season,
              Drew's impossible dream started seeming possible. Next thing I
              knew, we were in Miami, loading jet skis with enough supplies to
              survive a small apocalypse, about to turn a teenager's
              wooden-pencil sketch into reality.
            </p>

            <p>
              What followed was a two-week adventure through the Bahamian
              archipelago that defied common sense. We slept on abandoned
              islands, scaled lighthouses that looked like they hadn't seen
              maintenance since the Roosevelt administration, and made friends
              with stingrays who seemed suspiciously comfortable with our
              presence. Somewhere between discovering a submerged plane wreck
              and getting chased back to Bimini by storms, it occurred to us
              that we might have stumbled into something special
            </p>

            <p>⁂</p>

            <pre>░▒▓█</pre>

            <a className="cursor-pointer text-blue-400 underline decoration-blue-200 underline-offset-3 transition transition-colors hover:text-blue-600 hover:decoration-blue-400">
              Next article
            </a>
          </div>
        </article>
      </section>
    </div>
  );
}
