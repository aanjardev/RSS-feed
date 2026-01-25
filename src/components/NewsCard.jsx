export default function NewsCard({ item }) {
  return (
    <div
      className={`break-inside-avoid mb-4 p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer ${item.color || "bg-white"}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-black px-2 py-0.5 border border-black rounded-full bg-white">
          {item.category}
        </span>
        <span className="text-[10px] text-gray-600 font-mono">{item.date}</span>
      </div>
      <h2 className="font-bold text-sm leading-tight mb-2 uppercase tracking-tighter">
        {item.title}
      </h2>
      <p className="text-xs text-gray-800 line-clamp-6">{item.content}</p>
    </div>
  );
}
