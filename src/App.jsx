import { useState } from "react";
import { Menu, X, Search, Rss } from "lucide-react";
import { newsSources } from "./data";
import fallbackLogo from "./assets/logo-fallback.svg";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(() =>
    Object.fromEntries(newsSources.map((source) => [source.id, 5]))
  );

  const filteredSources = newsSources.filter((source) =>
    source.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShowMore = (sourceId, totalNews) => {
    setVisibleCount((prev) => {
      const current = prev[sourceId] ?? 5;
      const next = Math.min(current + 5, totalNews);
      return { ...prev, [sourceId]: next };
    });
  };

  const SidebarContent = ({ showClose = false }) => (
    <div className="py-6 px-4 flex flex-col h-full w-full gap-4">
      <div className="flex justify-between items-center border-b-4 border-neutral pb-3">
        <span className="font-black tracking-tight uppercase text-sm">
          RSS Feed Sources
        </span>
        {showClose && (
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="btn btn-sm btn-square btn-ghost border-2 border-neutral neo-hover"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <label className="input input-bordered input-lg flex items-center gap-2 shadow-[var(--shadow-1)] bg-base-200 border-2 border-neutral">
        <Search size={16} />
        <input
          type="text"
          className="grow text-sm placeholder:text-xs"
          placeholder="Cari sumber berita..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </label>

      <ul className="menu flex flex-col flex-nowrap flex-1 gap-1 w-full pr-1 max-h-[calc(100vh-200px)] overflow-y-auto">
        {filteredSources.map((source) => (
          <li key={source.id}>
            <button className="w-full justify-between font-semibold px-3 py-2 rounded-lg hover:bg-base-200 hover:border hover:border-neutral hover:shadow-[4px_4px_0_#111]">
              {source.name}
              <span className="text-xs font-black tracking-tight opacity-60 group-hover:opacity-100">
                ›
              </span>
            </button>
          </li>
        ))}
        {filteredSources.length === 0 && (
          <li className="text-center text-sm italic text-neutral/60">
            Sumber "{searchQuery}" tidak ditemukan
          </li>
        )}
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-100 text-neutral overflow-hidden flex flex-col">
      {/* --- NAVBAR --- */}
      <nav className="navbar px-6 border-b-4 border-neutral shadow-[var(--shadow-1)] fixed top-0 left-0 right-0 z-50 bg-base-100">
        <div className="navbar-start flex items-center gap-3">
          <div className="btn btn-square btn-primary border-2 border-neutral shadow-[var(--shadow-1)]">
            <Rss size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em]">
              Tilik
            </p>
            <h1 className="text-2xl font-black leading-tight tracking-tight">
              Feed
            </h1>
          </div>
        </div>

        <div className="navbar-end">
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="btn btn-square btn-ghost border-2 border-neutral neo-hover"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      <div className="flex flex-1 relative overflow-hidden pt-20">
        {/* --- MAIN FEED --- */}
        <main
          className={`overflow-y-auto px-4 md:px-8 lg:px-12 xl:px-16 py-8 flex-1 md:flex-none ${
            isSidebarOpen ? "md:w-[calc(100%-280px)]" : "md:w-full"
          }`}
        >
          <div className="mx-auto w-full max-w-[1280px] grid gap-5 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
            {newsSources.map((source) => {
              const shown = visibleCount[source.id] ?? 5;
              const canShowMore = shown < source.news.length;
              const logoUrl = source.logo || fallbackLogo;
              return (
                <div
                  key={source.id}
                  className="card card-bordered border-2 border-neutral bg-base-200 h-full min-h-0 shadow-[var(--shadow-1)]"
                >
                  {/* Header */}
                  <div className="px-3 py-3 sticky top-0 bg-base-200 border-b-2 border-neutral">
                    <div className="flex items-center gap-2">
                      <img
                        src={logoUrl}
                        alt={source.name}
                        className="w-12 h-12 object-cover"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <h2 className="card-title leading-tight text-base">
                          {source.name}
                        </h2>
                        <p className="text-xs opacity-70 truncate mt-1">
                          {source.sub}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* List Berita */}
                  <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 bg-base-100">
                    {source.news.slice(0, shown).map((item, idx) => (
                      <article
                        key={item.id}
                        className={`group card card-compact border border-neutral bg-base-200 shadow-[var(--shadow-1)] neo-hover ${
                          idx % 3 === 0
                            ? "bg-primary/10"
                            : idx % 3 === 1
                            ? "bg-secondary/10"
                            : "bg-accent/10"
                        }`}
                      >
                        <div className="card-body gap-3 px-3 py-3">
                          <h3 className="font-bold text-base leading-tight">
                            {item.title}
                          </h3>

                          {item.image && (
                            <figure className="rounded-lg overflow-hidden border border-neutral shadow-inner">
                              <img
                                src={item.image}
                                alt=""
                                className="w-full aspect-video object-cover"
                              />
                            </figure>
                          )}

                          <p className="text-sm leading-snug opacity-80 line-clamp-2">
                            {item.desc}
                          </p>

                          <div className="flex justify-between items-center text-xs font-semibold">
                            <span className="uppercase tracking-tight opacity-70">
                              {item.time}
                            </span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                              Read →
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="p-4 bg-base-200 border-t-2 border-neutral">
                    <button
                      className="btn btn-primary btn-block border-2 border-neutral shadow-[var(--shadow-1)] neo-hover"
                      onClick={() => handleShowMore(source.id, source.news.length)}
                      disabled={!canShowMore}
                    >
                      {canShowMore ? "Show More" : "All Caught Up"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* Desktop sidebar */}
        <aside
          className={`${isSidebarOpen ? "hidden md:flex" : "hidden"} fixed top-16 right-0 min-h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] w-[280px] bg-base-100 border-l-4 border-neutral shadow-[var(--shadow-1)] overflow-hidden`}
        >
          <SidebarContent />
        </aside>

        {/* Mobile drawer */}
        <aside
          className={`md:hidden fixed top-0 right-0 h-full w-[260px] bg-base-100 shadow-[var(--shadow-1)] z-[60] transform transition-transform duration-300 ease-in-out border-l-4 border-neutral ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <SidebarContent showClose />
        </aside>

        {isSidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-[1px] z-[55]"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
