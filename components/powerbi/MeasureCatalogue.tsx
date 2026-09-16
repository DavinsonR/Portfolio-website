import { TABLES, measuresOf, pbiUrl, type PbiMeasureName } from "@/lib/data/powerbi-model";

/* Seventeen rows, grouped by the table that owns them. DAX is set in the
   body face on purpose: this sheet has no mono type (DESIGN.md), and the
   FX identity on the lab page already reads fine in the sans. */

type Labels = {
  headers: { measure: string; dax: string; format: string; meaning: string };
  meaning: Record<PbiMeasureName, string>;
  measuresWord: string;
};

export default function MeasureCatalogue({ labels }: { labels: Labels }) {
  const groups = TABLES.map((t) => ({ table: t.name, rows: measuresOf(t.name) })).filter((g) => g.rows.length > 0);
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-t-2 border-ink text-[14px]">
        <thead>
          <tr className="text-left text-[12.5px] font-semibold tracking-[0.09em] text-muted uppercase">
            <th scope="col" className="py-3 pr-4 font-semibold">{labels.headers.measure}</th>
            <th scope="col" className="py-3 pr-4 font-semibold">{labels.headers.dax}</th>
            <th scope="col" className="py-3 pr-4 font-semibold">{labels.headers.format}</th>
            <th scope="col" className="py-3 font-semibold">{labels.headers.meaning}</th>
          </tr>
        </thead>
        {groups.map((g) => (
          <tbody key={g.table}>
            <tr className="bg-band">
              <th scope="colgroup" colSpan={4} className="py-2 pr-4 text-left text-[12.5px] font-semibold tracking-[0.09em] text-cold uppercase">
                <a href={pbiUrl.table(g.table)} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {g.table}
                </a>{" "}
                <span className="text-muted">· {g.rows.length} {labels.measuresWord}</span>
              </th>
            </tr>
            {g.rows.map((m) => (
              <tr key={m.name} className="border-t border-rulesoft align-top">
                <td className="py-3 pr-4 whitespace-nowrap">
                  <a
                    href={pbiUrl.measure(m)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-ink underline decoration-cold decoration-[1.5px] underline-offset-4 hover:text-cold"
                  >
                    {m.name}
                  </a>
                </td>
                <td className="py-3 pr-4 text-body break-words [font-variant-numeric:tabular-nums]">{m.dax}</td>
                <td className="py-3 pr-4 whitespace-nowrap text-muted [font-variant-numeric:tabular-nums]">{m.format}</td>
                <td className="py-3 max-w-[34ch] leading-[1.55] text-body">{labels.meaning[m.name]}</td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
