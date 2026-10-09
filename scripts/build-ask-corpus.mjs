// Builds the knowledge base for the "Ask about Zheng" chat from public site content.
// Runs before dev/build (see package.json). Output: src/generated/ask-corpus.json
//
// Included: the English resume, every project page (English version when both exist),
// and blog post titles/summaries. Nothing outside src/app is read, so private notes
// (e.g. interview/) can never reach the model.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const projectsDir = path.join(root, "src/app/work/projects");
const blogDir = path.join(root, "src/app/blog/posts");
const outFile = path.join(root, "src/generated/ask-corpus.json");

function clean(mdx) {
  return mdx
    .replace(/^(import|export) .*$/gm, "")
    .replace(/<[A-Z][\s\S]*?\/>/g, "") // self-closing JSX components
    .replace(/<\/?[A-Za-z][^>]*>/g, "") // remaining tags
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const docs = [];

const resume = matter(fs.readFileSync(path.join(projectsDir, "Resume.mdx"), "utf8"));
docs.push({ id: "resume", title: "Resume", url: "/resume", text: clean(resume.content) });

const projectFiles = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".mdx") && !f.startsWith("Resume"));
const bySlug = new Map();
for (const file of projectFiles) {
  const m = file.match(/^(.*?)(?:\.(en|ja))?\.mdx$/);
  const [, slug, lang] = m;
  const prev = bySlug.get(slug);
  // Prefer English, then a language-less file, then Japanese.
  const rank = (l) => (l === "en" ? 0 : l === undefined ? 1 : 2);
  if (!prev || rank(lang) < rank(prev.lang)) bySlug.set(slug, { file, lang });
}
for (const [slug, { file, lang }] of [...bySlug].sort()) {
  const { data, content } = matter(fs.readFileSync(path.join(projectsDir, file), "utf8"));
  if (!content.trim()) continue; // e.g. an unwritten placeholder page
  docs.push({
    id: `project:${slug}`,
    title: data.title || slug,
    url: lang ? `/work/${slug}/${lang}` : `/work/${slug}`,
    text: [data.summary, clean(content)].filter(Boolean).join("\n\n"),
  });
}

const posts = fs
  .readdirSync(blogDir)
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => {
    const { data } = matter(fs.readFileSync(path.join(blogDir, f), "utf8"));
    const slug = f.replace(/\.mdx$/, "");
    return `- ${data.title || slug} (${data.publishedAt || "undated"}) — /blog/${slug}${data.summary ? `: ${data.summary}` : ""}`;
  });
docs.push({ id: "blog-index", title: "Blog posts (titles only)", url: "/blog", text: posts.join("\n") });

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify({ builtAt: new Date().toISOString(), docs }, null, 2));
const chars = docs.reduce((n, d) => n + d.text.length, 0);
console.log(`ask-corpus: ${docs.length} docs, ${chars} chars -> ${path.relative(root, outFile)}`);
