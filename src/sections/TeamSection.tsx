import { TEAM_MEMBERS } from '../data/landingData';

export function TeamSection() {
  return (
    <section id="team" className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Team VirasatX &bull; SIH 2026
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built by Team VirasatX
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Uniting artificial intelligence, geospatial analysis, remote sensing, and frontline emergency response architecture.
          </p>
        </div>

        {/* 4 Professional Profile Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member, idx) => (
            <div
              key={idx}
              className="ner-card p-6 flex flex-col justify-between hover:border-blue-200 transition-all group"
            >
              <div>
                <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-slate-100 group-hover:border-blue-200 transition-colors shadow-sm">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                <h3 className="font-display text-base font-bold text-slate-900 mb-0.5">
                  {member.name}
                </h3>
                <div className="text-xs font-semibold text-blue-700 mb-1">
                  {member.role}
                </div>
                <div className="text-[11px] text-slate-400 font-medium mb-3">
                  {member.domain}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {member.bio}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 text-[10px] text-slate-400">
                <span>NER Field Research Contributor</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
