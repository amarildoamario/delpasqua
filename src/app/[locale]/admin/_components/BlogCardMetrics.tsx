import type { summarizeBlogCards } from "@/lib/server/blogCardMetrics";
import { BLOG_PRODUCT_POSITIONS } from "@/lib/analytics/events";

const date = new Intl.DateTimeFormat("it-IT", { dateStyle: "long", timeZone: "Europe/Rome" });
const shortDate = new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Rome" });
const rate = new Intl.NumberFormat("it-IT", { style: "percent", maximumFractionDigits: 1 });
const change = new Intl.NumberFormat("it-IT", { signDisplay: "exceptZero", maximumFractionDigits: 1 });
const phases = { before: "Prima", day: "Giorno della modifica", after: "Dopo" };
const positions = { title: "Accanto al titolo", after_first_paragraph: "Dopo il primo paragrafo", end: "In fondo all’articolo" };

export default function BlogCardMetrics({ report }: { report: ReturnType<typeof summarizeBlogCards> }) {
  return (
    <section id="card-prodotti-blog" aria-labelledby="titolo-card-prodotti-blog" className="scroll-mt-4 rounded-2xl border border-neutral-200 bg-white p-3 sm:p-4">
      <h3 id="titolo-card-prodotti-blog" className="text-sm font-bold">Card prodotto nel blog</h3>
      <p className="mt-1 text-xs text-neutral-700">
        <time dateTime={report.introductionDate} className="font-semibold">{date.format(new Date(report.introductionDate))}</time>
        {" · "}Il confronto include tutti i {report.articles.length} articoli del blog, in tutte le lingue.
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-[3fr_2fr]">
        <div>
          <h4 className="text-xs font-bold">Dall’articolo alla scheda prodotto</h4>
          <table className="mt-2 w-full text-xs tabular-nums">
            <caption className="sr-only">Passaggi allo shop prima e dopo la modifica nel periodo selezionato</caption>
            <thead className="text-right text-neutral-600">
              <tr>
                <th scope="col" className="py-1 text-left font-medium">Periodo</th>
                <th scope="col" className="px-1 font-medium">Sessioni articolo</th>
                <th scope="col" className="px-1 font-medium">Al prodotto</th>
                <th scope="col" className="font-medium">Tasso</th>
              </tr>
            </thead>
            <tbody>
              {report.periods.map((period) => (
                <tr key={period.phase} className="border-t border-neutral-100 text-right">
                  <th scope="row" className="py-1.5 text-left font-semibold">
                    {phases[period.phase]}
                    <span className="block text-[11px] font-normal text-neutral-500">
                      {shortDate.formatRange(new Date(period.startDate), new Date(period.endDate))}
                    </span>
                  </th>
                  <td className="px-1">{period.articleSessions}</td>
                  <td className="px-1">{period.productSessions}</td>
                  <td className="font-semibold">{period.rate === null ? "—" : rate.format(period.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs">
            {report.changePercentagePoints !== null
              ? <>Variazione dopo la modifica <b>{change.format(report.changePercentagePoints)} punti percentuali</b></>
              : "Per vedere la variazione servono sessioni misurate sia prima sia dopo la data della modifica."}
          </p>
          <p className="mt-2 text-[11px] text-neutral-600">Ogni sessione conta una volta, alla prima visita a uno degli articoli nel periodo selezionato. Il tasso indica quante di queste sessioni proseguono su una scheda prodotto.</p>
        </div>
        <div>
          <h4 className="text-xs font-bold">Clic sulle card nel periodo selezionato</h4>
          <dl className="mt-2 divide-y divide-neutral-100 text-xs">
            <div className="flex justify-between gap-2 py-1.5 font-semibold">
              <dt>Totale clic</dt>
              <dd className="tabular-nums">{report.totalClicks}</dd>
            </div>
            {BLOG_PRODUCT_POSITIONS.map((position) => (
              <div key={position} className="flex justify-between gap-2 py-1.5">
                <dt>{positions[position]}</dt>
                <dd className="font-semibold tabular-nums">{report.clicksByPosition[position]}</dd>
              </div>
            ))}
          </dl>
          <details className="mt-2 text-xs">
            <summary className="cursor-pointer font-semibold">Clic per articolo ({report.articles.length})</summary>
            <dl className="mt-2 divide-y divide-neutral-100">
              {report.articles.map((article) => (
                <div key={article.id} className="flex justify-between gap-2 py-1.5">
                  <dt>{article.title}</dt><dd className="tabular-nums">{article.clicks}</dd>
                </div>
              ))}
            </dl>
          </details>
        </div>
      </div>
    </section>
  );
}
