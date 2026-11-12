/**
 * Obsah 5. zadania – Business case a uskutočniteľnosť (projekt Tatra Budič / TABU).
 *
 * Všetky texty sú na jednom mieste, aby ich čítali rovnako
 *   • webová sekcia components/BusinessCase.tsx,
 *   • PDF na odovzdanie do Teamsu (generuje sa z týchto istých textov, nie je súčasť repozitára).
 *
 * Čísla z cudzích zdrojov majú odkaz [n] na SOURCES. Vlastné odhady sú v texte vždy
 * označené slovom „odhad“. Časové údaje sa dopočítavajú z lib/schedule.ts, takže po
 * posune termínu v harmonograme sa text upraví sám.
 */

import {
  SCHEDULE_END,
  STATUS_DATE,
  TASKS,
  TOTAL_DAYS,
  addDays,
  daysBetween,
  formatDM,
  formatDMY,
  scheduleStats,
  sk,
} from "./schedule";

// ---------------------------------------------------------------------------
// Zdroje (poradie = číslo v hranatej zátvorke; zoradené podľa prvého výskytu v texte)
// ---------------------------------------------------------------------------

export const SOURCES = [
  {
    key: "euba",
    title: "Ekonomická univerzita v Bratislave: Životný štýl študentov EU v Bratislave (prieskum 2017/18, n = 400)",
    url: "https://euba.sk/en/activities/news/1327-zivotny-styl-studentov-ekonomickej-univerzity-v-bratislave",
  },
  {
    key: "efsa",
    title: "EFSA (6. 3. 2013): Gathering consumption data on specific consumer groups of energy drinks – tlačová správa",
    url: "https://www.efsa.europa.eu/en/press/news/130306",
  },
  {
    key: "redbull",
    title: "Open Food Facts: Red Bull Energy Drink 250 ml – zloženie a výživové údaje",
    url: "https://world.openfoodfacts.org/product/9002490100070/red-bull-energy-drink",
  },
  {
    key: "tax",
    title: "Slovensko.sk: Daň zo sladených nealkoholických nápojov (zákon č. 251/2024 Z. z., účinný od 1. 1. 2025)",
    url: "https://www.slovensko.sk/sk/zivotne-situacie/zivotna-situacia/_dan-zo-sladenych-nealkoholicky",
  },
  {
    key: "bill",
    title: "Podnikajte.sk: Zákaz predaja energetických nápojov maloletým (návrh zákona o podmienkach predaja energetických nápojov)",
    url: "https://www.podnikajte.sk/pripravovane-zmeny-v-legislative/zakaz-predaja-energetickych-napojov-maloletym-od-1-5-2026",
  },
  {
    key: "billStage",
    title: "TASR / Koktejl (3. 6. 2025): Poslanci posunuli zákon o energetických nápojoch do druhého čítania",
    url: "https://koktejl.azet.sk/clanok/qKm43B8/stopka-pre-deti-poslanci-posunuli-zakon-o-energetickych-napojoch-do-druheho-citania-pravidla-sa-sprisnia/",
  },
  {
    key: "eu1169",
    title: "Nariadenie (EÚ) č. 1169/2011 o poskytovaní informácií o potravinách spotrebiteľom, príloha III (kofeín nad 150 mg/l)",
    url: "https://eur-lex.europa.eu/eli/reg/2011/1169/oj",
  },
  {
    key: "svachovka",
    title: "Svachovka (ČR): Stáčení nápojů do plechovek – od 500 ks, plechovky 250/330/500 ml",
    url: "https://www.svachovka.cz/nase-manufaktury/drinky-v-plechu",
  },
  {
    key: "celsius",
    title: "Dafit.cz: Celsius Energy Drink 355 ml – zloženie a obsah kofeínu",
    url: "https://dafit.cz/en/produkt/celsius-energy-drink-355-ml-343506",
  },
  {
    key: "tesco",
    title: "Tesco Potraviny domov: Energetické nápoje – ponuka a ceny (november 2026, bez zálohy 0,15 €)",
    url: "https://potravinydomov.itesco.sk/shop/sk-SK/browse/napoje/energeticke-a-sportove-napoje/energeticke-napoje",
  },
  {
    key: "supabase",
    title: "Supabase: Pricing – Free plan (500 MB databáza, 50 000 aktívnych používateľov mesačne, pauza po týždni bez aktivity, bez automatických záloh)",
    url: "https://supabase.com/pricing",
  },
  {
    key: "vercel",
    title: "Vercel: Fair use guidelines – plán Hobby je určený len na nekomerčné osobné použitie",
    url: "https://vercel.com/docs/limits/fair-use-guidelines",
  },
  {
    key: "plechovka",
    title: "Moja plechovka (Žilina): plechovky s vlastnou grafikou od 12 ks",
    url: "https://www.moja-plechovka.sk/",
  },
  {
    key: "manaroots",
    title: "Mana Roots: Cofilling – plnenie nápojov pod vlastnou značkou (len sklenené fľaše)",
    url: "https://manaroots.com/cofilling/",
  },
  {
    key: "vat",
    title: "Podnikajte.sk: Sadzby DPH od 1. 1. 2026",
    url: "https://www.podnikajte.sk/dan-z-pridanej-hodnoty/sadzby-dph-od-1-1-2026",
  },
] as const;

export type SourceKey = (typeof SOURCES)[number]["key"];

/** ref("efsa", "euba") → "[1][2]" */
function ref(...keys: SourceKey[]): string {
  return keys
    .map((key) => `[${SOURCES.findIndex((source) => source.key === key) + 1}]`)
    .join("");
}

// ---------------------------------------------------------------------------
// Čísla, z ktorých sa skladajú texty
// ---------------------------------------------------------------------------

const stats = scheduleStats();

function taskEnd(id: number): string {
  return TASKS.find((task) => task.id === id)?.end ?? SCHEDULE_END;
}

const PRICE_EUR = 2.9; // cena plechovky 330 ml z webu (ProductSection)
const CAN_LITRES = 0.33;
const VAT_RATE = 0.23; // základná sadzba DPH od 1. 1. 2026
const TAX_EUR_PER_LITRE = 0.3; // daň zo sladených nápojov s kofeínom nad 150 mg/l
const CAFFEINE_LIMIT_MG_PER_LITRE = 150;
const RED_BULL_CAN_EUR = 1.75;
const RED_BULL_EUR_PER_LITRE = 7.0;
const KPI_WINDOW_DAYS = 30;

const eur = (value: number) => `${value.toFixed(2).replace(".", ",")} €`;

const perLitre = PRICE_EUR / CAN_LITRES; // 8,79 €/l
const netPrice = PRICE_EUR / (1 + VAT_RATE); // po odpočítaní DPH
const taxPerCan = TAX_EUR_PER_LITRE * CAN_LITRES;
const netAfterTax = netPrice - taxPerCan;
const vsRedBullCan = Math.round((PRICE_EUR / RED_BULL_CAN_EUR - 1) * 100);
const vsRedBullLitre = Math.round((perLitre / RED_BULL_EUR_PER_LITRE - 1) * 100);
const times = (shelfEurPerLitre: number) => sk(Math.round((perLitre / shelfEurPerLitre) * 10) / 10);
const caffeineMgPerCan = CAFFEINE_LIMIT_MG_PER_LITRE * CAN_LITRES; // 49,5 mg

const dbDate = taskEnd(6);
const adminEnd = taskEnd(7);
const daysAfterDb = daysBetween(dbDate, SCHEDULE_END);
const latestKpiStart = addDays(SCHEDULE_END, -KPI_WINDOW_DAYS);

const doneIds = TASKS.filter((task) => task.status === "done").map((task) => task.id);
const dueIds = TASKS.filter((task) => (task.baseline?.end ?? task.end) < STATUS_DATE).map(
  (task) => task.id,
);
const idRange = (ids: number[]) => `#${Math.min(...ids)} – #${Math.max(...ids)}`;
const openDaysText = stats.openDays.map((open) => open.days).join(" + ");

// ---------------------------------------------------------------------------
// Typy
// ---------------------------------------------------------------------------

export interface StatItem {
  value: string;
  label: string;
}

export type Tone = "ok" | "conditional";
export type ItemTag = "Máme" | "Chýba" | "Riziko";

export interface FeasibilityItem {
  tag: ItemTag;
  text: string;
}

export interface FeasibilityBlock {
  id: string;
  title: string;
  verdict: string;
  tone: Tone;
  stats?: StatItem[];
  items: FeasibilityItem[];
}

// ---------------------------------------------------------------------------
// Hlavička
// ---------------------------------------------------------------------------

export const META = {
  kicker: "5. zadanie",
  title: "Business case a uskutočniteľnosť",
  project: "Tatra Budič (TABU)",
  statusLine: `Stav k ${formatDMY(STATUS_DATE)}`,
  lead: "Zdôvodnenie, prečo má Tatra Budič zmysel, a posúdenie, za akých podmienok je reálne uskutočniteľný. Čísla z cudzích zdrojov majú odkaz v hranatej zátvorke na zoznam zdrojov na konci; naše vlastné odhady sú vždy označené ako odhad.",
};

/** Tím podľa sekcie „Tím“ na webe (meno + rola) – použije sa v hlavičke PDF. */
export const TEAM = [
  { name: "Richard Baran", role: "Team Lead / Project Manager" },
  { name: "Maximilián Rastislav Petrič", role: "Analysis / Research" },
  { name: "Bohdan Titenko", role: "Development / Technology" },
  { name: "Vladyslav Humenetskyi", role: "Design / Creative" },
];

// ---------------------------------------------------------------------------
// A. Business case
// ---------------------------------------------------------------------------

export const BUSINESS_CASE = {
  problem: {
    text: `Energetické nápoje pije veľká časť našej cieľovej skupiny: 46,5 % študentov Ekonomickej univerzity v Bratislave ${ref("euba")} a 30 % dospelých v EÚ ${ref("efsa")}. Klasický Red Bull pritom obsahuje 11 g cukru na 100 ml (27,5 g v jednej plechovke), taurín, pridané vitamíny B a farbivá ${ref("redbull")}. Kategória sa na Slovensku zároveň reguluje: od 1. 1. 2025 platí daň zo sladených nápojov, pri kofeíne nad 150 mg/l dvojnásobná ${ref("tax")}, a v parlamente je návrh zákazu predaja energetických nápojov osobám mladším ako 16 rokov ${ref("bill", "billStage")}. Predpokladáme, že časť dospelých hľadá na učenie a šport prírodnejší, bylinný nápoj bez cukrovej záťaže mainstreamových značiek – a práve to náš web overuje pomocou KPI.`,
    stats: [
      {
        value: "46,5 %",
        label: `študentov Ekonomickej univerzity v Bratislave pije energetické nápoje (prieskum 2017/18, n = 400) ${ref("euba")}`,
      },
      {
        value: "30 %",
        label: `dospelých v EÚ vypilo energetický nápoj za posledný rok (EFSA, 16 štátov) ${ref("efsa")}`,
      },
      {
        value: "27,5 g",
        label: `cukru v jednej plechovke klasického Red Bullu 250 ml ${ref("redbull")}`,
      },
    ] as StatItem[],
  },

  goals: {
    main: `Do ${formatDMY(SCHEDULE_END)} prevádzkovať funkčný predobjednávkový web TABU, na ktorom reálne zmeriame dopyt po bylinnom energetickom nápoji, a podľa nameraných dát rozhodnúť, či pristúpiť k výrobe prvej dávky.`,
    sub: [
      {
        title: "Trvalé ukladanie objednávok",
        text: "Pripojiť databázu Supabase tak, aby sa každá objednávka z formulára uložila do tabuľky orders. Kód je pripravený, zostáva konfigurácia a test.",
        deadline: `${formatDMY(dbDate)} (Gantt #6)`,
        measure: "Testovacia objednávka sa objaví v databáze.",
      },
      {
        title: "Overenie dopytu cez KPI",
        text: "Dosiahnuť cieľové hodnoty KPI: priemerne > 4 ks na objednávku, konverzia formulára ≥ 8 % a ≥ 20 % návštevníkov, ktorí sa vrátia do 30 dní.",
        deadline: `meranie od spustenia, vyhodnotenie do ${formatDMY(SCHEDULE_END)}`,
        measure: "Sekcia KPI na webe + dáta z databázy a analytiky.",
      },
      {
        title: "Prevádzka bez zásahov do databázy",
        text: "Administrátorský panel s prihlásením a prehľadom objednávok, aby tím nemusel objednávky spracúvať priamo v databáze.",
        deadline: `${formatDMY(adminEnd)} (Gantt #7)`,
        measure: "Administrátor sa prihlási a vidí zoznam objednávok.",
      },
      {
        title: "Podklady pre rozhodnutie o výrobe",
        text: "Mať zmapované regulačné náklady (označovanie kofeínu, daň, záloha na obal), ponuku výrobcu pilotnej dávky a kalkuláciu jednotkových nákladov.",
        deadline: `${formatDMY(SCHEDULE_END)} (koniec projektu)`,
        measure: "Rozhodnutie go / no-go podľa podmienok v štúdii uskutočniteľnosti.",
      },
    ],
  },

  audience: [
    {
      kind: "primary" as const,
      title: "Študenti vysokých škôl (18+)",
      text: "Testovacia skupina priamo na kampuse. Potrebujú sa sústrediť pri učení a skúškach, chcú nápoj, ktorý nie je len ďalšia sladká plechovka, a jednoduchú objednávku cez web bez hľadania v obchode.",
      evidence: `46,5 % študentov EUBA pije energetické nápoje ${ref("euba")}`,
    },
    {
      kind: "secondary" as const,
      title: "Hráči, športovci a turisti (18+)",
      text: "Potrebujú energiu počas dlhých herných relácií, tréningu alebo túry a chuťovo príjemnú plechovku, ktorú majú pri sebe.",
      evidence: `52 % dospelých konzumentov pije energetické nápoje pri športe ${ref("efsa")}`,
    },
    {
      kind: "excluded" as const,
      title: "Deti a mladiství (do 18 rokov)",
      text: `TABU na nich necielime: etiketa nápojov s kofeínom nad 150 mg/l musí upozorňovať, že nie sú vhodné pre deti a tehotné či dojčiace ženy ${ref("eu1169")}, a návrh zákona by zakázal ich predaj osobám mladším ako 16 rokov ${ref("bill")}.`,
      evidence: "",
    },
  ],

  benefits: [
    {
      title: "Prírodnejšia alternatíva",
      text: `Bylinný základ (mäta, horské byliny, guarana, extrakt zo zeleného čaju) a bez umelých farbív – podľa receptúry, ktorú web sľubuje a ktorú ešte musíme overiť. Klasický Red Bull má cukor, taurín a farbivá ${ref("redbull")}.`,
    },
    {
      title: "Tri príchute z jedného základu",
      text: "Classic, Exotic (yuzu, liči) a Tropical (mango, marakuja) vychádzajú z jednej základnej receptúry: zákazník má výber a výroba zostáva jednoduchá.",
    },
    {
      title: "Lokálny príbeh a priamy predaj",
      text: "Bylinný príbeh z Vysokých Tatier a predaj priamo cez web na kampuse – bez marže obchodných reťazcov a bez boja o miesto na regáli.",
    },
    {
      title: "Dopyt overený pred výrobou",
      text: `Predobjednávky ukážu, či sa oplatí vyrábať. Najmenšia nami nájdená dávka plechoviek 330 ml je 500 ks ${ref("svachovka")}, takže sa rozhodneme až podľa nameraného dopytu.`,
    },
  ],

  differentiation: `Odlišnosť nie je v samotných látkach – guarana a zelený čaj sú aj v nápoji Celsius ${ref("celsius")}. TABU sa odlišuje kombináciou bylinného a lokálneho príbehu, troch príchutí a priameho predaja študentom; vyššiu cenu musí ospravedlniť práve táto hodnota.`,

  competition: {
    /** riadok TABU na porovnanie – zobrazí sa v tabuľke ako prvý a zvýraznený */
    self: {
      name: "TABU 330 ml",
      price: `2,90 € (${sk(Math.round(perLitre * 100) / 100)} €/l) – cena z nášho webu`,
      offer: "Bylinný základ (mäta, horské byliny, guarana, extrakt zo zeleného čaju), tri príchute, bez umelých farbív; predaj priamo cez web.",
      meaning: "Prémiová cena za prírodnejší a lokálny produkt – hodnotu musí potvrdiť dopyt (KPI).",
    },
    rows: [
      {
        name: "Red Bull 250 ml",
        price: `1,75 € (7,00 €/l) ${ref("tesco")}`,
        offer: `Sacharóza a glukóza (11 g/100 ml), taurín, kofeín 32 mg/100 ml (80 mg v plechovke), vitamíny B, farbivá ${ref("redbull")}.`,
        meaning: `Etalón kategórie. TABU je za plechovku o ${vsRedBullCan} % drahšie (na liter o ${vsRedBullLitre} %), no s iným profilom: bylinný základ namiesto cukru, taurínu a farbív.`,
      },
      {
        name: "Monster Energy 500 ml",
        price: `1,65 € (3,30 €/l) ${ref("tesco")}`,
        offer: "Veľké balenie (500 ml) za nízku cenu.",
        meaning: `Na liter je TABU ${times(3.3)}× drahšie – s cenou a objemom nesúťažíme.`,
      },
      {
        name: "Hell 250 ml, Tiger 500 ml",
        price: `0,98 € (3,92 €/l), 1,35 € (2,70 €/l) ${ref("tesco")}`,
        offer: "Lacné značky, ktoré sú bežne v ponuke obchodu.",
        meaning: `Na liter je TABU ${times(3.92)}× resp. ${times(2.7)}× drahšie – cenová súťaž nie je naša cesta.`,
      },
      {
        name: "Celsius 355 ml",
        price: "cenu sme neoverili",
        offer: `200 mg kofeínu v plechovke (56 mg/100 ml), zelený čaj, guarana a zázvor, 0 g cukru ${ref("celsius")}.`,
        meaning: "Najbližší koncept: má rovnaké kľúčové látky ako TABU, takže samotné zloženie na odlíšenie nestačí.",
      },
      {
        name: "Káva a čaj",
        price: "–",
        offer: "Tradičné zdroje kofeínu, dostupné všade.",
        meaning: "TABU ich nenahrádza; ponúka studenú, ochutenú plechovku na cesty a šport.",
      },
    ],
    verdict: `Súťaž cenou s mainstreamom nie je možná: 2,90 € za 330 ml (${sk(Math.round(perLitre * 100) / 100)} €/l) je o ${vsRedBullCan} % viac než plechovka Red Bullu a o ${vsRedBullLitre} % viac na liter ${ref("tesco")}. TABU môže uspieť len ako prémiová, prírodná a lokálna voľba pre ľudí, ktorí si ju vedome vyberú – a presne to merajú naše KPI (priemerne > 4 ks na objednávku, konverzia ≥ 8 %).`,
  },
};

// ---------------------------------------------------------------------------
// B. Štúdia uskutočniteľnosti
// ---------------------------------------------------------------------------

const technicalWeb: FeasibilityBlock = {
  id: "technical-web",
  title: "Technická uskutočniteľnosť – web a predobjednávky",
  verdict: "Uskutočniteľné",
  tone: "ok",
  items: [
    {
      tag: "Máme",
      text: "Hotový základ: web na Next.js 15, Tailwind CSS a TypeScript beží na Vercel; Modul 1 (UI, ponuka, formulár) je hotový.",
    },
    {
      tag: "Máme",
      text: "Kód pre databázu už existuje – lib/db.ts, database/schema.sql (tabuľky products a orders) a API /api/orders. Bez databázy appka beží na záložných dátach, takže pripojenie je len konfigurácia (spustiť SQL schému, nastaviť dve premenné prostredia, nasadiť znova), nie vývoj od nuly.",
    },
    {
      tag: "Máme",
      text: `Bezplatné služby stačia: Supabase Free dáva 500 MB databázy a 50 000 aktívnych používateľov mesačne ${ref("supabase")}. Objednávka je jeden riadok s menom, e-mailom a množstvom, takže kapacita nie je obmedzením.`,
    },
    {
      tag: "Chýba",
      text: "Meranie KPI: balík @vercel/analytics nie je v projekte (ani náhradné meranie cez localStorage), takže KPI č. 2 a č. 3 sa zatiaľ merať nedajú; KPI č. 1 a č. 2 navyše potrebujú pripojenú databázu.",
    },
    {
      tag: "Chýba",
      text: "Prihlasovanie a administrácia (Modul 3): zatiaľ nie je hotové nič a je to pre tím najnovšia oblasť (Supabase Auth, ochrana dát).",
    },
    {
      tag: "Chýba",
      text: `Platby a overenie veku: formulár je ukážková objednávka bez platby. Reálny predaj by potreboval platobnú bránu a – ak návrh zákona o veku prejde – aj elektronické overenie veku v e-shope ${ref("bill")}.`,
    },
    {
      tag: "Riziko",
      text: `Supabase Free pozastaví projekt po týždni bez aktivity a nerobí automatické zálohy ${ref("supabase")}: po týždni ticha by formulár prestal ukladať objednávky. Opatrenie: pravidelná testovacia objednávka pred prezentáciami a ručný export tabuľky.`,
    },
    {
      tag: "Riziko",
      text: `Vercel Hobby je len na nekomerčné použitie; za komerčné sa považuje aj reklama predaja produktu ${ref("vercel")}. Pri reálnom predaji nápoja preto treba prejsť na platený plán.`,
    },
  ],
};

const technicalProduct: FeasibilityBlock = {
  id: "technical-product",
  title: "Technická uskutočniteľnosť – výroba nápoja",
  verdict: "Podmienečne",
  tone: "conditional",
  items: [
    {
      tag: "Máme",
      text: `Dodávatelia pre malé série existujú, vlastné plniace vybavenie nepotrebujeme: Svachovka (ČR) plní plechovky 250/330/500 ml už od 500 ks, etikety trvajú približne 3 týždne a cena je na vyžiadanie ${ref("svachovka")}. Moja plechovka (Žilina) ponúka plechovky s vlastnou grafikou od 12 ks (pri 0,25 l 1,94 – 2,45 € za kus podľa počtu) ${ref("plechovka")} – hodí sa na hmatateľný prototyp vzhľadu, či vedia naplniť našu receptúru, stránka neuvádza. Mana Roots plní len do skla (od 1 450 ks), pre plechovku nevyhovuje ${ref("manaroots")}.`,
    },
    {
      tag: "Chýba",
      text: "Overená receptúra: web neuvádza obsah kofeínu ani cukru, receptúra nie je laboratórne ani senzoricky otestovaná a plechovky na webe sú vizualizácie, nie fyzický produkt. Potrebujeme technológa výrobcu alebo konzultanta na návrh receptúry a nutričných hodnôt.",
    },
    {
      tag: "Riziko",
      text: `Hranica ${CAFFEINE_LIMIT_MG_PER_LITRE} mg kofeínu na liter (≈ ${sk(caffeineMgPerCan)} mg v našej 330 ml plechovke) rozhoduje o dvoch veciach: či je na obale povinné upozornenie „Vysoký obsah kofeínu“ s údajom v mg/100 ml ${ref("eu1169")} a či sa pri sladenom nápoji platí daň 0,30 € namiesto 0,15 € za liter (≈ ${eur(taxPerCan)} na plechovku) ${ref("tax")}. Red Bull má 320 mg/l ${ref("redbull")} a Celsius 560 mg/l ${ref("celsius")}, takže produkt vnímaný ako „energy“ túto hranicu prakticky prekročí – rozhodnutie o kofeíne treba urobiť pred výrobou.`,
    },
    {
      tag: "Riziko",
      text: `Texty o produkte: tvrdenia ako „Energia bez pádu“ z nášho webu by pri skutočnom predaji bolo treba preveriť podľa pravidiel o výživových a zdravotných tvrdeniach (nariadenie (ES) č. 1924/2006). Plechovky sa v SR navyše predávajú so zálohou 0,15 € ${ref("tesco")}.`,
    },
  ],
};

const organizational: FeasibilityBlock = {
  id: "organizational",
  title: "Organizačná a prevádzková uskutočniteľnosť",
  verdict: "V semestri áno · po semestri podmienečne",
  tone: "conditional",
  items: [
    {
      tag: "Máme",
      text: "Štvorčlenný tím s rozdelenými rolami: Team Lead / PM (harmonogram, odovzdávanie zadaní, kontakt s výrobcom), Analysis / Research (konkurencia, legislatíva, vyhodnotenie KPI), Development / Technology (web, databáza, API, administrátorský panel, nasadenie), Design / Creative (vizuály plechoviek, UI, texty).",
    },
    {
      tag: "Máme",
      text: "Postupujeme inkrementálne po moduloch (Modul 1 – 3): každý modul končí funkčnou verziou webu. Modul 1 je hotový a nasadený, Modul 2 (databáza) je v kóde pripravený – sklz v Module 3 (administrácia) ich neohrozí.",
    },
    {
      tag: "Máme",
      text: `Prevádzka pilotu stojí 0 € (Vercel Hobby + Supabase Free) ${ref("supabase", "vercel")}; objednávky sú predobjednávky bez platby, takže netreba ani platobnú bránu.`,
    },
    {
      tag: "Chýba",
      text: "Určený správca objednávok: zatiaľ nie je dohodnuté, kto predobjednávky číta a odpovedá na ne. Návrh: Team Lead číta objednávky priamo v tabuľke Supabase a odpovedá e-mailom, kým nie je hotový administrátorský panel (Gantt #7); potom ich spracúva cez panel.",
    },
    {
      tag: "Chýba",
      text: "Podnikateľský subjekt a financovanie – nemáme ani jedno. Predaj potravín bez podnikateľského subjektu nie je možný a nie je ani cieľom semestra.",
    },
    {
      tag: "Riziko",
      text: "Osobné údaje: formulár zbiera meno a e-mail. Web už uvádza, že ich použijeme len v rámci univerzitného projektu; pri pripojení databázy treba zvoliť región v EÚ a po skončení projektu údaje zmazať.",
    },
    {
      tag: "Riziko",
      text: `Po semestri nemá projekt zaručeného vlastníka ani rozpočet: pokračovanie závisí od rozhodnutia tímu podľa KPI. Pri no-go ostane web ako portfólio zdarma; pri go treba platené plány (Supabase Pro od 25 USD mesačne ${ref("supabase")}, platený plán Vercel ${ref("vercel")}), výrobcu a právnu kontrolu.`,
    },
  ],
};

const time: FeasibilityBlock = {
  id: "time",
  title: "Časová uskutočniteľnosť",
  verdict: "Reálne, ale bez rezervy",
  tone: "conditional",
  stats: [
    {
      value: `${stats.doneCount} / ${stats.total}`,
      label: `úloh hotových k ${formatDM(STATUS_DATE)} (${sk(stats.donePct)} %); uplynulo ${sk(stats.elapsedPct)} % času (${stats.elapsedDays} z ${TOTAL_DAYS} dní)`,
    },
    {
      value: `+${stats.endShiftDays} dní`,
      label: `posun konca projektu: z ${formatDMY(stats.originalEnd)} na ${formatDMY(SCHEDULE_END)}`,
    },
    {
      value: `${stats.remainingDays} dní`,
      label: `do konca zostáva, ${stats.openDays.length} úlohy po ${openDaysText} dní`,
    },
    {
      value: "0 dní",
      label: "časová rezerva na konci harmonogramu",
    },
  ],
  items: [
    {
      tag: "Máme",
      text: `Úlohy ${idRange(doneIds)} sú hotové a overiteľné v repozitári a na nasadenom webe. Kód pre #6 je napísaný, zostáva konfigurácia a test (pripojiť databázu) – odhad: niekoľko hodín práce plus testovanie, na ktoré je k dispozícii ${stats.openDays.find((open) => open.id === 6)?.days ?? 0} dní.`,
    },
    {
      tag: "Riziko",
      text: `Plán sa už raz ukázal ako optimistický: podľa pôvodného harmonogramu mali byť k ${formatDM(STATUS_DATE)} hotové úlohy ${idRange(dueIds)}, hotové sú ${idRange(doneIds)}. Ďalší sklz pri #6 posunie celý reťazec #7 – #8 za ${formatDMY(SCHEDULE_END)}, lebo rezerva je nulová.`,
    },
    {
      tag: "Riziko",
      text: "Najrizikovejšia je úloha #7 (administrátorský panel): je to nová oblasť (prihlasovanie) a trvá len 14 dní. Opatrenie: minimálny rozsah – prihlásenie a zoznam objednávok; správu produktov robíme, len ak zostane čas. Nedokončený Modul 3 neblokuje nasadenie hotových modulov.",
    },
    {
      tag: "Riziko",
      text: `Meranie KPI: 30-dňové okno pre KPI č. 3 (návrat návštevníkov) sa do harmonogramu zmestí, len ak meranie spustíme najneskôr ${formatDMY(latestKpiStart)} (${KPI_WINDOW_DAYS} dní do ${formatDMY(SCHEDULE_END)}); po pripojení databázy ${formatDMY(dbDate)} by sme mali len ${daysAfterDb} dní. Opatrenie: pridať analytiku čo najskôr – nezávisí od databázy.`,
    },
  ],
};

export const FEASIBILITY = {
  intro: "Posudzujeme dve veci oddelene: webovú platformu s overením dopytu v rámci semestra a výrobu skutočného nápoja po semestri. Pri každej uvádzame, čo už máme, čo chýba a čo nás ohrozuje.",
  blocks: [technicalWeb, technicalProduct, organizational, time] as FeasibilityBlock[],
  overall: {
    verdict: "Web TABU s predobjednávkami a meraním dopytu je v rámci semestra uskutočniteľný – technicky aj organizačne, časovo bez rezervy. Výroba skutočného nápoja je uskutočniteľná len podmienečne: nie je cieľom semestra a môže sa spustiť až po splnení podmienok nižšie.",
    constraints: [
      {
        title: "Receptúra a výroba",
        text: `Bez overenej receptúry a zazmluvneného výrobcu nie je čo predávať; najmenšia nami nájdená dávka plechoviek 330 ml je 500 ks ${ref("svachovka")}.`,
      },
      {
        title: "Regulácia",
        text: `Kofeín nad ${CAFFEINE_LIMIT_MG_PER_LITRE} mg/l znamená povinné upozornenie na obale a – pri sladenom nápoji – dvojnásobnú daň ${ref("eu1169", "tax")}; zdravotné tvrdenia na webe a obale; záloha 0,15 € na plechovku ${ref("tesco")}; návrh zákazu predaja osobám do 16 rokov a overovania veku v e-shopoch ${ref("bill")}, ktorý prešiel do druhého čítania ${ref("billStage")} – o jeho schválení sme ku dňu spracovania nenašli správu, stav treba pred predajom overiť.`,
      },
      {
        title: "Cena a ekonomika",
        text: `Ak je 2,90 € konečná cena s DPH, po odpočítaní DPH 23 % ${ref("vat")} zostane ${eur(netPrice)}; ak je nápoj sladený a má kofeín nad ${CAFFEINE_LIMIT_MG_PER_LITRE} mg/l, po odpočítaní dane ≈ ${eur(taxPerCan)} ${ref("tax")} už len ≈ ${eur(netAfterTax)} na plechovku (odhad) – a z toho ešte treba zaplatiť výrobu, plechovku, zálohu a distribúciu. Výrobné náklady zatiaľ nepoznáme.`,
      },
      {
        title: "Platformy",
        text: `Vercel Hobby (len nekomerčné použitie) a Supabase Free (pauza po 7 dňoch, bez záloh) stačia len na pilot ${ref("supabase", "vercel")}.`,
      },
      {
        title: "Čas a ľudia",
        text: "Nulová časová rezerva, nová a najrizikovejšia úloha je administrátorský panel; tím je študentský, bez podnikateľského subjektu a bez financovania.",
      },
    ],
    conditions: [
      {
        id: "G1",
        title: "Dopyt",
        text: "Všetky tri KPI dosiahnuté: priemerne > 4 ks na objednávku, konverzia ≥ 8 % a ≥ 20 % návratnosť do 30 dní.",
      },
      {
        id: "G2",
        title: "Cena od výrobcu",
        text: `Cenová ponuka na pilotnú dávku (od 500 ks, 330 ml) s jednotkovými nákladmi (výroba, plechovka, záloha, doprava) pod čistým výnosom ≈ ${eur(netAfterTax)} na plechovku; ak nie, cenu 2,90 € treba prehodnotiť.`,
      },
      {
        id: "G3",
        title: "Receptúra a označenie",
        text: `Zvolená úroveň kofeínu (pod alebo nad ${CAFFEINE_LIMIT_MG_PER_LITRE} mg/l), nutričné hodnoty a upravené tvrdenia na obale aj na webe podľa nariadení (EÚ) č. 1169/2011 a (ES) č. 1924/2006.`,
      },
      {
        id: "G4",
        title: "Právo a prevádzka",
        text: "Podnikateľský subjekt, kontrola názvu a ochrannej známky, text o ochrane osobných údajov a prechod na platené plány Vercel a Supabase pri reálnom predaji.",
      },
    ],
  },
};
