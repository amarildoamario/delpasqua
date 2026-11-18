const headingPattern = /^(#{2,3})[ \t]+(.+)$/;

export function getBlogHeading(block: string) {
    const match = headingPattern.exec(block);
    if (!match) return null;

    const [, marker, title] = match;
    const id = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    return { title, id, level: marker.length };
}

function getBlockType(line: string) {
    if (line === "---" || line === "***" || headingPattern.test(line)) return "standalone";
    if (/^[-*]\s/.test(line)) return "bullets";
    if (/^\d+\.\s/.test(line)) return "numbered";
    if (line.startsWith("> ")) return "quote";
    if (line.startsWith("|") && line.endsWith("|")) return "table";
    return "paragraph";
}

export function getBlogContentBlocks(content: string): string[] {
    const blocks: string[] = [];
    let lines: string[] = [];
    let blockType = "";

    function flush() {
        if (lines.length) blocks.push(lines.join("\n"));
        lines = [];
        blockType = "";
    }

    for (const sourceLine of content.split(/\r\n?|\n/)) {
        const line = sourceLine.trim();

        if (blockType === "cta") {
            if (line) lines.push(line);
            if (line === ":::") flush();
            continue;
        }

        if (!line) {
            flush();
            continue;
        }

        const type = line === ":::cta" ? "cta" : getBlockType(line);
        if (type !== blockType || type === "standalone") flush();
        blockType = type;
        lines.push(line);
    }

    flush();
    return blocks;
}
