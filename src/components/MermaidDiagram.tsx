"use client";

import mermaid from "mermaid";
import { useEffect, useId, useState } from "react";

import { Row } from "@once-ui-system/core";

type MermaidDiagramProps = {
  chart: string;
};

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const reactId = useId();
  const [svg, setSvg] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const id = `mermaid-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: "default",
    });

    mermaid
      .render(id, chart)
      .then(({ svg }) => {
        if (!cancelled) {
          setSvg(svg);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setSvg("");
          setError(err instanceof Error ? err.message : "Failed to render Mermaid diagram.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [chart, reactId]);

  return (
    <Row
      fillWidth
      overflowX="auto"
      radius="m"
      border="neutral-alpha-weak"
      background="surface"
      padding="16"
      marginTop="8"
      marginBottom="16"
    >
      {error ? (
        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{error}</pre>
      ) : (
        <div
          style={{ minWidth: "100%" }}
          dangerouslySetInnerHTML={{ __html: svg }}
          suppressHydrationWarning
        />
      )}
    </Row>
  );
}
