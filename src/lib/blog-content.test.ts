import assert from "node:assert/strict";
import test from "node:test";
import { getBlogContentBlocks, getBlogHeading } from "./blog-content";

test("Windows and Unix articles render the same editorial blocks and headings", () => {
    const expected = [
        "## Analisi dell’olio",
        "Due passaggi:",
        "1. Titolazione\n2. Calcolo",
        "### Risultati",
        "- Acidità\n- Perossidi",
        "> Nota di laboratorio",
        "| Metodo | Valore |\n| --- | --- |\n| ISO 660 | 0,2% |",
        "---",
        ":::cta\nTitolo\nTesto\n[Scopri](/shop)\n:::",
    ];
    const article = expected.slice(0, -1).join("\n") + "\n\n" + expected.at(-1);

    for (const lineEnding of ["\n", "\r\n"]) {
        const blocks = getBlogContentBlocks(article.replaceAll("\n", lineEnding));
        assert.deepEqual(blocks, expected);
        assert.deepEqual(blocks.map(getBlogHeading).filter(Boolean), [
            { title: "Analisi dell’olio", id: "analisi-dellolio", level: 2 },
            { title: "Risultati", id: "risultati", level: 3 },
        ]);
    }
});
