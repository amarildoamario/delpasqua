import type { summarizeBlogCards } from "@/lib/server/blogCardMetrics";
import { BLOG_PRODUCT_POSITIONS } from "@/lib/analytics/events";
import InfoTooltip from "./InfoTooltip";

const date = new Intl.DateTimeFormat("it-IT", { dateStyle: "long", timeZone: "Europe/Rome" });
const shortDate = new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Rome" });
const rate = new Intl.NumberFormat("it-IT", { style: "percent", maximumFractionDigits: 1 });
const phases = { before: "Prima", after: "Dopo" };
const positions = { title: "Accanto al titolo", after_first_paragraph: "Dopo il primo paragrafo", end: "In fondo all’articolo" };
const routeLabels = [
  { key: "withCardClick", label: "Clic su card" },
  { key: "viaShopList", label: "Dall’elenco Shop" },
  { key: "other", label: "Altro" },
] as const;

export default function BlogCardMetrics({ report }: { report: ReturnType<typeof summarizeBlogCards> }) {
  return (
    <section id="card-prodotti-blog" aria-labelledby="titolo-card-prodotti-blog" className="scroll-mt-4 rounded-2xl border border-neutral-200 bg-white p-3 sm:p-4">
      <h3 id="titolo-card-prodotti-blog" className="text-sm font-bold">Card prodotto nel blog</h3>
      <div className="mt-3 grid gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <h4 className="text-xs font-bold">Dal blog alla scheda prodotto</h4>
          <table className="mt-2 w-full text-xs tabular-nums">
            <caption className="sr-only">Sessioni dal blog alla scheda prodotto prima e dopo l’introduzione delle card</caption>
            <thead className="text-right text-neutral-600">
              <tr>
                <th scope="col" className="py-1 text-left font-medium">Periodo</th>
                <th scope="col" className="px-1 font-medium">Sessioni blog</th>
                <th scope="col" className="px-1 font-medium">Al prodotto</th>
                <th scope="col" className="px-1 font-medium">Tasso</th>
                <th scope="col" className="pl-2 text-left font-medium">Percorso</th>
              </tr>
            </thead>
            <tbody>
              {report.periods.map(({ phase, startDate, endDate, blogSessions, productSessions, rate: conversionRate, routes }) => (
                <tr key={phase} className="border-t border-neutral-100 text-right">
                  <th scope="row" className="py-1.5 text-left font-semibold">
                    {phases[phase]}
                    <span className="block text-[11px] font-normal text-neutral-500">
                      {shortDate.formatRange(new Date(startDate), new Date(endDate))}
                    </span>
                  </th>
                  <td className="px-1">{blogSessions}</td>
                  <td className="px-1">{productSessions}</td>
                  <td className="px-1 font-semibold">{conversionRate === null ? "—" : rate.format(conversionRate)}</td>
                  <td className="py-1.5 pl-2 text-left">
                    {routes ? (
                      <dl className="grid gap-x-2 gap-y-0.5 lg:grid-cols-3">
                        {routeLabels.map(({ key, label }) => (
                          <div key={key} className="min-w-0 leading-tight">
                            <dt className="inline text-neutral-600">{label}</dt>{" "}
                            <dd className="inline font-bold">{routes[key]}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : (
                      <span className="text-neutral-500">
                        <span aria-hidden="true">—</span>
                        <span className="sr-only">Prima dell’avvio del tracciamento</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-neutral-200 text-right font-semibold">
                <th scope="row" className="py-1.5 text-left">Totale</th>
                <td className="px-1">{report.totalBlogSessions}</td>
                <td className="px-1">{report.totalProductSessions}</td>
                <td className="px-1">{report.totalBlogSessions ? rate.format(report.totalProductSessions / report.totalBlogSessions) : "—"}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="min-w-0 border-t border-neutral-200 pt-3 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-4">
          <h4 className="flex items-center gap-1 text-xs font-bold">
            Clic sulle card
            <InfoTooltip label="Clic sulle card" description={`Ogni clic conta, anche se avviene nella stessa sessione o non è seguito dall’apertura della scheda. I clic sono rilevati dalle 00:00 del ${date.format(new Date(report.introductionDate))}, ora italiana.`} />
          </h4>
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
