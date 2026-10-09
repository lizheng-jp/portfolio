"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { HiOutlineChatBubbleLeftRight, HiOutlinePaperAirplane, HiXMark } from "react-icons/hi2";
import styles from "./AskWidget.module.scss";

type Turn = { role: "user" | "assistant"; text: string };

const SUGGESTIONS = [
  "What LLM / AI work has he done?",
  "画像AIの経験を教えてください",
  "他的后端技术栈是什么？",
];

// Minimal, safe markdown: **bold**, [text](url), "- " bullets, line breaks. No raw HTML.
function renderInline(raw: string, keyPrefix: string) {
  // The model sometimes wraps citations in extra brackets: "[[Resume](/resume)]" -> "[Resume](/resume)".
  const text = raw
    .replace(/\[(\[[^[\]]+\]\([^)\s]+\))\]/g, "$1")
    .replace(/(\]\([^)\s]+\))(?=\[)/g, "$1 "); // keep adjacent citations apart
  const out: React.ReactNode[] = [];
  const pattern = /\[([^[\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > last) out.push(text.slice(last, match.index));
    if (match[1]) {
      const href = match[2];
      const safe = href.startsWith("/") || href.startsWith("https://") || href.startsWith("mailto:");
      out.push(
        safe ? (
          <a key={`${keyPrefix}-${i++}`} href={href} target={href.startsWith("/") ? undefined : "_blank"} rel="noreferrer">
            {match[1]}
          </a>
        ) : (
          match[1]
        ),
      );
    } else {
      out.push(<strong key={`${keyPrefix}-${i++}`}>{match[3]}</strong>);
    }
    last = pattern.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function Markdown({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];
  const flush = (k: number) => {
    if (list.length) {
      blocks.push(
        <ul key={`ul-${k}`}>
          {list.map((item, j) => (
            <li key={j}>{renderInline(item, `li-${k}-${j}`)}</li>
          ))}
        </ul>,
      );
      list = [];
    }
  };
  lines.forEach((line, k) => {
    const bullet = line.match(/^\s*[-*•]\s+(.*)/);
    if (bullet) {
      list.push(bullet[1]);
      return;
    }
    flush(k);
    if (line.trim()) blocks.push(<p key={`p-${k}`}>{renderInline(line, `p-${k}`)}</p>);
  });
  flush(lines.length);
  return <Fragment>{blocks}</Fragment>;
}

export function AskWidget() {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [turns]);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || busy) return;
    const history: Turn[] = [...turns, { role: "user", text: q }];
    setTurns([...history, { role: "assistant", text: "" }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) throw new Error(await res.text());
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setTurns([...history, { role: "assistant", text: answer }]);
      }
      if (!answer.trim()) throw new Error("Empty answer. Please try again.");
    } catch (e) {
      const message = e instanceof Error && e.message ? e.message : "Something went wrong. Please try again.";
      setTurns([...history, { role: "assistant", text: `⚠️ ${message}` }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {open && (
        <section className={styles.panel} aria-label="Ask about Zheng">
          <header className={styles.header}>
            <div>
              <strong>Ask about Zheng</strong>
              <span className={styles.sub}>AI answers from this site · 日本語 / English / 中文</span>
            </div>
            <button className={styles.iconButton} onClick={() => setOpen(false)} aria-label="Close">
              <HiXMark />
            </button>
          </header>

          <div className={styles.messages} ref={listRef}>
            {turns.length === 0 && (
              <div className={styles.empty}>
                <p>Ask about Zheng&apos;s experience, projects, or skills. Answers cite the pages they come from.</p>
                {SUGGESTIONS.map((s) => (
                  <button key={s} className={styles.suggestion} onClick={() => ask(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            {turns.map((t, i) => (
              <div key={i} className={t.role === "user" ? styles.user : styles.assistant}>
                {t.role === "assistant" ? (
                  t.text ? <Markdown text={t.text} /> : <span className={styles.typing}>…</span>
                ) : (
                  t.text
                )}
              </div>
            ))}
          </div>

          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              maxLength={500}
              rows={1}
              placeholder="Ask a question…"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  ask(input);
                }
              }}
            />
            <button className={styles.send} type="submit" disabled={busy || !input.trim()} aria-label="Send">
              <HiOutlinePaperAirplane />
            </button>
          </form>
          <p className={styles.note}>
            Answers are generated by Google Gemini from this site&apos;s content and may contain mistakes. Questions are sent to
            Google; please don&apos;t include personal information.
          </p>
        </section>
      )}
      <button
        className={styles.launcher}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Ask about Zheng"}
        aria-expanded={open}
      >
        {open ? <HiXMark /> : <HiOutlineChatBubbleLeftRight />}
      </button>
    </>
  );
}
