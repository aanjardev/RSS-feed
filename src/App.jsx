import { useState } from "react";
import { Menu, X, Search, Rss } from "lucide-react";
import { newsSources } from "./data";

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
    <div className="py-6 pl-4 pr-0 flex flex-col h-full w-full">
      <div className="flex justify-between items-center mb-5 border-b pb-3 pr-4">
        <span className="font-bold text-gray-800 tracking-tight uppercase text-sm">
          RSS Feed Sources
        </span>
        {showClose && (
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        )}
      </div>

      <div className="relative mb-5 pr-4">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={16}
        />
        <input
          type="text"
          placeholder="Cari sumber berita..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FAB005]/30 transition-all"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 pr-2">
        {filteredSources.map((source) => (
          <button
            key={source.id}
            className="w-full text-left px-4 py-3 text-[14px] text-gray-600 hover:bg-[#FDFCF0] hover:text-[#FAB005] rounded-xl transition-all font-semibold flex items-center justify-between group"
          >
            {source.name}
            <span className="opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0 font-bold">
              →
            </span>
          </button>
        ))}
        {filteredSources.length === 0 && (
          <p className="text-center text-gray-400 text-xs mt-10 italic">
            Sumber "{searchQuery}" tidak ditemukan
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCF0] font-sans text-[#333] overflow-hidden flex flex-col">
      {/* --- NAVBAR --- */}
      <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-[#FAB005] p-1.5 rounded-lg shadow-sm">
            <Rss size={23} className="text-white" />
          </div>
          <h1 className="text-2xl font-black italic tracking-tighter text-[#444]">
            Tilik <span className="text-[#666]">Feed</span>
          </h1>
        </div>

        <button
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={28} />
        </button>
      </nav>

      <div className="flex flex-1 relative h-[calc(100vh-64px)] overflow-hidden">
        {/* --- MAIN FEED --- */}
        <main
          className={`overflow-y-auto bg-[#F1F0E8] px-4 md:px-5 lg:px-10 xl:px-14 py-27 flex-1 md:flex-none ${
            isSidebarOpen ? "md:w-[calc(100%-260px)]" : "md:w-full"
          }`}
        >
          <div className="mx-auto w-full max-w-full md:max-w-full lg:max-w-[1360px] grid gap-y-3 gap-x-3 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] lg:grid-cols-5">
            {newsSources.map((source) => {
              const shown = visibleCount[source.id] ?? 5;
              const canShowMore = shown < source.news.length;
              return (
                <div
                  key={source.id}
                  className="w-full bg-[#EAE8DC] rounded-md flex flex-col h-full border border-black/5 shadow-sm"
                >
                  {/* Header */}
                  <div className="p-4 bg-[#e3e0cf] rounded-t-xl sticky top-0 z-10 border-b border-black/5">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-black rounded flex items-center justify-center text-[10px] text-white font-bold uppercase">
                        {source.name.substring(0, 2)}
                      </div>
                      <h2 className="font-bold text-lg leading-none tracking-tight">
                        {source.name}
                      </h2>
                    </div>
                    <p className="text-[12px] text-gray-500 truncate">
                      {source.sub}
                    </p>
                  </div>

                  {/* List Berita */}
                  <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 custom-scrollbar bg-[#F1F0E8]">
                    {source.news.slice(0, shown).map((item) => (
                      <div
                        key={item.id}
                        className={`group cursor-pointer rounded-md overflow-hidden shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-black/5 ${item.color}`}
                      >
                        <div className="p-2">
                          <h3 className="text-[16px] font-semibold leading-tight mb-3 tracking-tight text-[#222]">
                            {item.title}
                          </h3>

                          {item.image && (
                            <img
                              src={item.image}
                              alt=""
                              className="w-full aspect-video object-cover rounded-sm mb-3 shadow-inner"
                            />
                          )}

                          <p className="text-[14px] text-gray-600 leading-snug mb-3 line-clamp-2">
                            {item.desc}
                          </p>

                          <div className="flex justify-between items-center text-[12px] text-gray-500 italic font-normal pt-2">
                            <span>{item.time}</span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                              Read Full →
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-[#F1F0E8] rounded-b-xl">
                    <button
                      className="w-full py-2.5 bg-white/70 hover:bg-white text-[12px] font-bold text-gray-600 rounded-lg transition-colors border border-black/5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
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

        <aside
          className={`${isSidebarOpen ? "hidden md:flex" : "hidden"} fixed top-16 right-0 h-[calc(100vh-64px)] w-[260px] bg-white border-l border-gray-100 shadow-inner overflow-y-auto`}
        >
          <SidebarContent />
        </aside>

        <aside
          className={`md:hidden fixed top-0 right-0 h-full w-[260px] bg-white shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out border-l border-gray-100 ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <SidebarContent showClose />
        </aside>

        {isSidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/10 backdrop-blur-[1px] z-[55]"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
