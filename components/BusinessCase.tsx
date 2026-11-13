import Reveal from "./Reveal";
import {
  BUSINESS_CASE,
  DECISION,
  FEASIBILITY,
  META,
  PDF_DOWNLOAD,
  SOURCES,
  type FeasibilityBlock,
  type ItemTag,
  type Tone,
} from "@/lib/businessCaseContent";

// Celý text je v lib/businessCaseContent.ts (rovnaký zdroj používa aj PDF export),
// termíny a počty dní sa dopočítavajú z lib/schedule.ts. Tu je len vzhľad.

const TAG_STYLES: Record<ItemTag, string> = {
  Máme: "bg-emerald-100 text-emerald-800",
  Chýba: "bg-amber-100 text-amber-800",
  Riziko: "bg-rose-100 text-rose-800",
};

const VERDICT_STYLES: Record<Tone, string> = {
  ok: "bg-emerald-500 text-forest-950",
  conditional: "bg-amber-400 text-forest-950",
  no: "bg-rose-600 text-white",
};

const AUDIENCE_STYLES = {
  primary: {
    card: "border-emerald-200 bg-emerald-50",
    badge: "bg-emerald-500 text-forest-950",
    label: "Primárna skupina",
  },
  secondary: {
    card: "border-forest-100 bg-forest-50",
    badge: "bg-forest-700 text-white",
    label: "Sekundárna skupina",
  },
  excluded: {
    card: "border-rose-200 bg-rose-50",
    badge: "bg-rose-600 text-white",
    label: "Mimo cieľovej skupiny",
  },
} as const;

function PartHeading({ letter, title }: { letter: string; title: string }) {
  return (
    <div className="flex items-center gap-4">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-950 font-display text-base font-semibold text-white"
        aria-hidden="true"
      >
        {letter}
      </span>
      <h3 className="font-display text-2xl font-semibold tracking-tight text-forest-950 sm:text-3xl">
        {title}
      </h3>
    </div>
  );
}

function BlockTitle({ children }: { children: string }) {
  return <h4 className="font-display text-xl font-semibold text-forest-950">{children}</h4>;
}

function FeasibilityCard({ block }: { block: FeasibilityBlock }) {
  return (
    <article className="rounded-2xl border border-forest-100 bg-white p-6 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="font-display text-lg font-semibold text-forest-950">{block.title}</h4>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${VERDICT_STYLES[block.tone]}`}
        >
          {block.verdict}
        </span>
      </div>

      {block.stats && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {block.stats.map((stat) => (
            <div key={stat.value + stat.label} className="rounded-xl bg-forest-50 p-4">
              <p className="font-display text-2xl font-semibold text-forest-950">{stat.value}</p>
              <p className="mt-1 text-xs leading-snug text-forest-600">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      <ul className="mt-5 space-y-3">
        {block.items.map((item) => (
          <li
            key={item.tag + item.text.slice(0, 40)}
            className="flex flex-col items-start gap-1.5 text-sm leading-relaxed text-forest-700 sm:flex-row sm:gap-3"
          >
            <span
              className={`h-fit shrink-0 rounded-md px-2 py-0.5 text-center text-[11px] font-semibold uppercase tracking-wide sm:mt-0.5 sm:w-16 ${TAG_STYLES[item.tag]}`}
            >
              {item.tag}
            </span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function BusinessCase() {
  const { problem, goals, audience, benefits, differentiation, competition } = BUSINESS_CASE;
  const { overall } = FEASIBILITY;

  return (
    <section id="business-case" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
            {META.kicker} · {META.statusLine}
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-forest-950">
            {META.title}
          </h2>
          <p className="mt-5 leading-relaxed text-forest-700">{META.lead}</p>
        </Reveal>

        {/* ---------------------------- Rozhodnutie tímu ---------------------------- */}
        <Reveal className="mt-8 max-w-3xl">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-widest text-rose-700">
              {DECISION.label}
            </p>
            <p className="mt-2 font-display text-xl font-semibold leading-snug text-forest-950 sm:text-2xl">
              {DECISION.title}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-forest-700">{DECISION.text}</p>
          </div>
        </Reveal>

        {/* ------------------------------ A. Business case ------------------------------ */}
        <div className="mt-16 space-y-14">
          <Reveal>
            <PartHeading letter="A" title="Business case" />
          </Reveal>

          <Reveal>
            <BlockTitle>Problém a potreba</BlockTitle>
            <p className="mt-3 max-w-3xl leading-relaxed text-forest-700">{problem.text}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {problem.stats.map((stat) => (
                <div
                  key={stat.value}
                  className="rounded-2xl border border-forest-100 bg-forest-50 p-6"
                >
                  <p className="font-display text-4xl font-semibold text-forest-950">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm leading-snug text-forest-700">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <BlockTitle>Cieľ projektu</BlockTitle>
            <div className="mt-4 rounded-2xl bg-forest-950 p-7 text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">
                Hlavný cieľ
              </p>
              <p className="mt-2 font-display text-xl font-medium leading-snug sm:text-2xl">
                {goals.main}
              </p>
            </div>
            <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-forest-500">
              Čiastkové ciele
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {goals.sub.map((goal, index) => (
                <article
                  key={goal.title}
                  className="flex flex-col rounded-2xl border border-forest-100 bg-white p-6"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 font-display text-xs font-semibold text-forest-950"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <h5 className="font-display text-base font-semibold text-forest-950">
                      {goal.title}
                    </h5>
                  </div>
                  <p className="mb-4 mt-3 text-sm leading-relaxed text-forest-700">{goal.text}</p>
                  <dl className="mt-auto space-y-1 border-t border-forest-100 pt-3 text-xs text-forest-600">
                    <div className="flex gap-2">
                      <dt className="shrink-0 font-semibold text-forest-950">Termín:</dt>
                      <dd>{goal.deadline}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="shrink-0 font-semibold text-forest-950">Meranie:</dt>
                      <dd>{goal.measure}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <BlockTitle>Cieľová skupina</BlockTitle>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {audience.map((group) => {
                const style = AUDIENCE_STYLES[group.kind];
                return (
                  <article
                    key={group.title}
                    className={`flex flex-col rounded-2xl border p-6 ${style.card}`}
                  >
                    <span
                      className={`w-fit rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${style.badge}`}
                    >
                      {style.label}
                    </span>
                    <h5 className="mt-4 font-display text-base font-semibold text-forest-950">
                      {group.title}
                    </h5>
                    <p className="mt-2 text-sm leading-relaxed text-forest-700">{group.text}</p>
                    {group.evidence && (
                      <p className="mt-auto pt-4 text-xs font-medium text-forest-600">
                        {group.evidence}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          </Reveal>

          <Reveal>
            <BlockTitle>Očakávané prínosy a odlišnosť</BlockTitle>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <article
                  key={benefit.title}
                  className="rounded-2xl border border-forest-100 bg-forest-50 p-6"
                >
                  <h5 className="font-display text-base font-semibold text-forest-950">
                    {benefit.title}
                  </h5>
                  <p className="mt-2 text-sm leading-relaxed text-forest-700">{benefit.text}</p>
                </article>
              ))}
            </div>
            <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm leading-relaxed text-forest-700">
              <span className="font-semibold text-forest-950">Čím sa odlišujeme – a čím nie. </span>
              {differentiation}
            </p>
          </Reveal>

          <Reveal>
            <BlockTitle>Konkurencia a alternatívy</BlockTitle>
            <p className="mt-2 text-xs text-forest-500 lg:hidden">
              Tabuľku môžete posúvať do strany.
            </p>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-forest-100">
              <table className="w-full min-w-[860px] border-collapse text-left text-sm">
                <thead className="bg-forest-50 text-xs uppercase tracking-wider text-forest-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Alternatíva</th>
                    <th className="px-4 py-3 font-semibold">Cena na regáli (Tesco SK, 11/2026)</th>
                    <th className="px-4 py-3 font-semibold">Čo ponúka</th>
                    <th className="px-4 py-3 font-semibold">Čo to znamená pre TABU</th>
                  </tr>
                </thead>
                <tbody>
                  {[competition.self, ...competition.rows].map((row, index) => (
                    <tr
                      key={row.name}
                      className={`border-t border-forest-100 align-top ${index === 0 ? "bg-emerald-50" : "bg-white"}`}
                    >
                      <td className="px-4 py-3 font-medium text-forest-950">{row.name}</td>
                      <td className="px-4 py-3 text-forest-700">{row.price}</td>
                      <td className="px-4 py-3 text-forest-700">{row.offer}</td>
                      <td className="px-4 py-3 text-forest-700">{row.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-forest-700">
              <span className="font-semibold text-forest-950">Záver: </span>
              {competition.verdict}
            </p>
          </Reveal>
        </div>

        {/* ------------------------ B. Štúdia uskutočniteľnosti ------------------------- */}
        <div className="mt-20 space-y-8">
          <Reveal>
            <PartHeading letter="B" title="Štúdia uskutočniteľnosti" />
            <p className="mt-4 max-w-3xl leading-relaxed text-forest-700">{FEASIBILITY.intro}</p>
          </Reveal>

          {FEASIBILITY.blocks.map((block) => (
            <Reveal key={block.id}>
              <FeasibilityCard block={block} />
            </Reveal>
          ))}

          <Reveal>
            <div className="rounded-2xl bg-forest-950 p-7 text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">
                Celkové zhodnotenie
              </p>
              <p className="mt-2 font-display text-lg font-medium leading-snug sm:text-xl">
                {overall.verdict}
              </p>
            </div>

            <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-forest-500">
              Zásadné obmedzenia
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {overall.constraints.map((constraint, index) => (
                <article
                  key={constraint.title}
                  className="rounded-2xl border border-rose-200 bg-rose-50 p-6"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-600 font-display text-xs font-semibold text-white"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <h5 className="font-display text-base font-semibold text-forest-950">
                      {constraint.title}
                    </h5>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-forest-700">{constraint.text}</p>
                </article>
              ))}
            </div>

            <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-forest-500">
              {overall.conditionsTitle}
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {overall.conditions.map((condition) => (
                <article
                  key={condition.id}
                  className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 px-2.5 font-display text-xs font-semibold text-forest-950"
                      aria-hidden="true"
                    >
                      {condition.id}
                    </span>
                    <h5 className="font-display text-base font-semibold text-forest-950">
                      {condition.title}
                    </h5>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-forest-700">{condition.text}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>

        {/* -------------------------------- Zdroje -------------------------------- */}
        <Reveal className="mt-16">
          <h4 className="font-display text-base font-semibold text-forest-950">Zdroje</h4>
          <ol className="mt-3 space-y-1.5 text-xs leading-relaxed text-forest-600">
            {SOURCES.map((source, index) => (
              <li key={source.key} className="flex gap-2">
                <span className="w-6 shrink-0 font-semibold text-forest-950">[{index + 1}]</span>
                <span className="min-w-0">
                  {source.title} –{" "}
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-emerald-700 underline underline-offset-2 hover:text-emerald-600"
                  >
                    {source.url}
                  </a>
                </span>
              </li>
            ))}
          </ol>
        </Reveal>

        {/* ------------------------- PDF – úplne na konci Zadaní ------------------------- */}
        <Reveal className="mt-14">
          <div className="flex flex-col gap-5 rounded-2xl border border-forest-100 bg-forest-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="max-w-xl">
              <p className="font-display text-lg font-semibold text-forest-950">
                {PDF_DOWNLOAD.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-forest-600">{PDF_DOWNLOAD.text}</p>
            </div>
            <a
              href={PDF_DOWNLOAD.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-forest-950 px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-forest-800"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                <path d="M14 3v5h5" />
                <path d="M9 13h6M9 17h4" />
              </svg>
              {PDF_DOWNLOAD.button}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
