import Reveal from "./Reveal";

// Week columns start Monday 14. 9. 2026 (odhadovaný štart projektu) a bežia
// do polovice decembra. Dátumy zadaní 1–4 sú prevzaté priamo z reálnej
// histórie odovzdávania v Teams (27. 9. / 11. 10. / 18. 10. / 25. 10.);
// 9. 11. a 23. 11. sú dohodnuté s cvičiacim. Štart (14. 9.) a finálne
// odovzdanie (18. 12.) sú odhad – uprav podľa reálneho rozvrhu.
const WEEKS = [
  "14. 9.", "21. 9.", "28. 9.", "5. 10.", "12. 10.", "19. 10.", "26. 10.",
  "2. 11.", "9. 11.", "16. 11.", "23. 11.", "30. 11.", "7. 12.", "14. 12.",
];

const GRID_TEMPLATE = "minmax(230px,300px) repeat(14, minmax(40px, 1fr))";

type Status = "done" | "current" | "planned";

interface Task {
  id: number;
  name: string;
  dates: string;
  note: string;
  status: Status;
  colStart: number;
  colEnd: number;
}

const TASKS: Task[] = [
  {
    id: 1,
    name: "Zadanie 1 – Akronym, anotácia, webstránka a Kanban tabuľka",
    dates: "14. 9.* – 27. 9.",
    note: "štart projektu · odovzdané",
    status: "done",
    colStart: 2,
    colEnd: 4,
  },
  {
    id: 2,
    name: "Zadanie 2 – Model realizácie projektu a KPI",
    dates: "28. 9. – 11. 10.",
    note: "nadväzuje na #1 · odovzdané",
    status: "done",
    colStart: 4,
    colEnd: 6,
  },
  {
    id: 3,
    name: "Zadanie 3 – SWOT analýza",
    dates: "12. 10. – 18. 10.",
    note: "nadväzuje na #2 · odovzdané",
    status: "done",
    colStart: 6,
    colEnd: 7,
  },
  {
    id: 4,
    name: "Zadanie 4 – Ganttov diagram",
    dates: "19. 10. – 25. 10.",
    note: "nadväzuje na #3 · termín 25. 10.",
    status: "current",
    colStart: 7,
    colEnd: 8,
  },
  {
    id: 5,
    name: "Redizajn a rozšírenie ponuky (nové foto, 3 príchute)",
    dates: "26. 10. – 9. 11.",
    note: "nadväzuje na #4 · prezentácia na cvičení 9. 11.",
    status: "planned",
    colStart: 8,
    colEnd: 10,
  },
  {
    id: 6,
    name: "Pripojenie databázy (Modul 2 – Supabase)",
    dates: "9. 11. – 23. 11.",
    note: "nadväzuje na #5 · dokončenie 23. 11.",
    status: "planned",
    colStart: 10,
    colEnd: 12,
  },
  {
    id: 7,
    name: "Autentifikácia a administrácia (Modul 3)",
    dates: "23. 11. – 7. 12.",
    note: "nadväzuje na #6",
    status: "planned",
    colStart: 12,
    colEnd: 14,
  },
  {
    id: 8,
    name: "Testovanie a finálna prezentácia",
    dates: "7. 12. – 18. 12.*",
    note: "nadväzuje na #7 · koniec projektu",
    status: "planned",
    colStart: 14,
    colEnd: 16,
  },
];

const BAR_STYLES: Record<Status, string> = {
  done: "h-6 rounded-md bg-emerald-600",
  current: "h-6 rounded-md bg-amber-500",
  planned: "h-6 rounded-md border-2 border-forest-200 bg-forest-50",
};

export default function GanttChart() {
  return (
    <section id="gantt" className="bg-forest-50 py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-forest-950">
            Ganttov diagram
          </h2>
          <p className="mt-5 leading-relaxed text-forest-700">
            Plán projektu od úvodnej analýzy po finálne odovzdanie – 8 úloh a ich trvanie.
            Celý reťazec tvorí jednu kritickú cestu: každá úloha priamo nadväzuje na
            predchádzajúcu, žiadne dve sa nedajú robiť súbežne.
          </p>
        </Reveal>

        <Reveal delayMs={100}>
          <div className="mt-12 overflow-x-auto rounded-2xl border border-forest-100 bg-white p-6">
            <div className="min-w-[860px]">
              <div className="grid gap-x-1 pb-2" style={{ gridTemplateColumns: GRID_TEMPLATE }}>
                <div />
                {WEEKS.map((week) => (
                  <div key={week} className="text-center text-[11px] font-medium text-forest-400">
                    {week}
                  </div>
                ))}
              </div>

              {TASKS.map((task) => (
                <div
                  key={task.id}
                  className="grid items-center gap-x-1 border-t border-forest-100 py-3"
                  style={{ gridTemplateColumns: GRID_TEMPLATE }}
                >
                  <div className="pr-4">
                    <p className="text-sm font-medium text-forest-950">
                      {task.id}. {task.name}
                    </p>
                    <p className="mt-0.5 text-xs text-forest-400">
                      {task.dates} · {task.note}
                    </p>
                  </div>
                  <div
                    style={{ gridColumn: `${task.colStart} / ${task.colEnd}` }}
                    className={BAR_STYLES[task.status]}
                  />
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delayMs={150}>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-forest-600">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-5 rounded-sm bg-emerald-600" aria-hidden="true" />
              Odovzdané
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-5 rounded-sm bg-amber-500" aria-hidden="true" />
              Aktuálny termín
            </span>
            <span className="inline-flex items-center gap-2">
              <span
                className="h-2.5 w-5 rounded-sm border-2 border-forest-200 bg-forest-50"
                aria-hidden="true"
              />
              Plánované
            </span>
          </div>
          <p className="mt-3 text-xs text-forest-400">
            Termíny zadaní 1 – 4 sú potvrdené históriou odovzdávania v Teams (27. 9. / 11. 10. /
            18. 10. / 25. 10.); 9. 11. a 23. 11. sú dohodnuté s cvičiacim. * 14. 9. (štart) a
            18. 12. (finálne odovzdanie) sú odhad – uprav podľa reálneho rozvrhu.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
