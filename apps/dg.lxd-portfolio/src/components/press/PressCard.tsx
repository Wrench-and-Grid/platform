type PressCardProps = {
  title: string;
  source: string;
  date: string;
  excerpt: string;
  image: string;
  href: string;
  rotate?: string;
  onClick?: () => void;
};

export default function PressCard({ title, source, date, excerpt, image, href, rotate, onClick }: PressCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative block w-full max-w-[420px] no-underline${rotate ? ` ${rotate}` : ""}`}
      onClick={onClick ? (e) => { e.preventDefault(); onClick(); } : undefined}
    >
      <div className="relative flex flex-col bg-[#F4F1EA] shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden">
        {/* Paper texture — requires /public/textures/paper.png */}
        <div
          className="absolute inset-0 pointer-events-none bg-[url('/textures/paper.png')] opacity-[0.15] mix-blend-multiply z-10"
          aria-hidden="true"
        />

        <img
          src={image}
          alt=""
          className="w-full h-auto object-cover grayscale"
          loading="lazy"
          decoding="async"
        />

        <div className="relative z-20 flex flex-col gap-3 p-5">
          <div className="flex justify-between border-b border-neutral-300 pb-2 text-[10px] sm:text-xs uppercase tracking-[0.12em] text-neutral-500">
            <span>{source}</span>
            <span>{date}</span>
          </div>

          <h3 className="font-serif text-lg sm:text-xl leading-snug text-neutral-900 m-0">
            {title}
          </h3>

          <p className="text-sm text-neutral-600 leading-relaxed m-0">{excerpt}</p>

          <span className="text-[11px] uppercase tracking-[0.2em] text-[#ff5b22] mt-1">
            Read More →
          </span>
        </div>

        {/* Paper edge gradient */}
        <div
          className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-b from-transparent to-[#eae6dc]/60 pointer-events-none z-20"
          aria-hidden="true"
        />
      </div>
    </a>
  );
}
