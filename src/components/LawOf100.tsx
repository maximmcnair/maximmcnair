import React from "react";

interface Props {
  amount: number;
}

export const LawOf100: React.FC<Props> = ({ amount }) => {
  const rows = Array.from({ length: 10 }, (v, i) => i);
  const columns = Array.from({ length: 10 }, (v, i) => i + 1);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {rows.map((r) => (
        <div
          key={`row-${r}`}
          style={{
            width: (30 + 10) * 10,
            display: "flex",
            marginBottom: 10,
          }}
        >
          {columns.map((c) => {
            const done = amount >= c + r * 10;
            return (
              <div
                key={`${r}-{c}`}
                style={{
                  height: 30,
                  width: 30,
                  marginRight: 10,
                  border: `2px solid var(${
                    done ? "--color-white" : "--color-grey"
                  })`,
                  color: `var(--color-white)`,
                  textAlign: "center",
                }}
              >
                {done ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : null}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
