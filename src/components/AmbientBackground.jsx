/**
 * Fixed, non-interactive colour field behind the whole app. The frosted panels
 * blur *this* — without enough variation back here, glass reads as flat grey.
 */
export default function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* warm base wash */}
      <div className="absolute inset-0 bg-[linear-gradient(140deg,#f8f7f2_0%,#efece3_38%,#e4e9e3_72%,#dbe4dc_100%)]" />

      {/* mint bloom, top right */}
      <div className="absolute -right-40 -top-56 h-[40rem] w-[40rem] rounded-full bg-mint-400/22 blur-[120px] sm:bg-mint-400/55" />
      {/* deeper mint, bottom left */}
      <div className="absolute -bottom-72 -left-56 h-[46rem] w-[46rem] rounded-full bg-mint-500/16 blur-[140px] sm:bg-mint-500/40" />
      {/* warm sand, centre */}
      <div className="absolute left-1/3 top-1/4 h-[34rem] w-[34rem] rounded-full bg-[#e0cfae]/30 blur-[130px] sm:bg-[#e0cfae]/60" />
      {/* cool halo, lower right */}
      <div className="absolute -right-24 bottom-0 h-[30rem] w-[30rem] rounded-full bg-[#cfe3ee]/25 blur-[120px] sm:bg-[#cfe3ee]/50" />

      {/* diagonal light beams across the surface */}
      <div className="absolute -left-1/4 -top-1/3 h-[170%] w-[55%] rotate-[24deg] bg-gradient-to-r from-transparent via-white/70 to-transparent blur-3xl" />
      <div className="absolute left-[55%] -top-1/3 h-[170%] w-[18%] rotate-[24deg] bg-gradient-to-r from-transparent via-white/45 to-transparent blur-2xl" />

      {/* fine grain, keeps the large soft areas from banding */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  )
}
