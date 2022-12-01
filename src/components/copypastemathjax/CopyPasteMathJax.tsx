import { useState } from "react";
import katex from "katex";
import "./copyPasteMathJax.css";

import { formulas, Formula } from "./formulas";

function Formula({ formula: { name, formula } }: { formula: Formula }) {
  const [showMsg, setShowMsg] = useState(false);

  function copyFormula() {
    setShowMsg(true);
    navigator.clipboard.writeText(formula);

    setTimeout(() => {
      setShowMsg(false);
    }, 1000);
  }

  return (
    <div className="formula" key={`${name}-${formula}`} onClick={copyFormula}>
      <span className="formula-name">{name}</span>
      <div
        className="formula-display"
        dangerouslySetInnerHTML={{
          __html: (katex || "-").renderToString(formula, {
            throwOnError: false,
            displayMode: true,
          }),
        }}
      />
      <pre
        className="formula-code"
        style={{
          textAlign: formula.split("\n").length > 1 ? "left" : "center",
        }}
      >
        <code>{formula}</code>
      </pre>
      <div className="formula-copy" />
      {showMsg ? <span className="formula-copied">Copied!</span> : null}
    </div>
  );
}

export default function CopyPasteMathJax() {
  const [search, setSearch] = useState("");

  const filteredFormulas = formulas.filter(({ name = "" }) => {
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <nav className="math-nav">
        <h1>Copy Paste MathJax</h1>
        <h4>Click on an expression to copy to your clipboard</h4>
      </nav>
      <div className="math-container">
        <div className="math-search-wrapper">
          <input
            className="math-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for expressions..."
          />
        </div>

        <div className="formulas">
          {filteredFormulas.map((formula) => (
            <Formula formula={formula} />
          ))}
        </div>

        {filteredFormulas.length === 0 ? (
          <span className="formula-search-error">
            Nothing found for "{search}"
          </span>
        ) : null}
      </div>
    </>
  );
}
