import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

function MermaidRenderer({ chart }) {
  const ref = useRef(null);
  const chartId = useRef(`mermaidChart-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !chart ||
      !ref.current ||
      !chart.trim().startsWith("graph")
    ) {
      ref.current.innerHTML = "<b style='color:red'>Invalid or empty Mermaid diagram</b>";
      return;
    }

    mermaid.initialize({ startOnLoad: false });
    try {
      ref.current.innerHTML = "";
      mermaid.render(chartId.current, chart, (svgCode) => {
        ref.current.innerHTML = svgCode;
      });
    } catch (e) {
      ref.current.innerHTML = "<b style='color:red'>Invalid Mermaid diagram</b>";
    }
  }, [chart]);

  return <div ref={ref} />;
}

export default MermaidRenderer;