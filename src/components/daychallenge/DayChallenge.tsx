import React, { useState } from "react";
import "./daychallenge.css";

function range(amount: number) {
  return [...Array(amount).keys()].map((n) => n + 1);
}

export default function DayChallenge() {
  const [days, setDays] = useState(5);
  const [title, setTitle] = useState("A tool a day");

  const [done, setDone] = useState([1]);

  // <span>Day Challenge Terminal</span>

  function addOrRemove(array: number[], val: number) {
    if (array.includes(val)) {
      return array.filter((v) => v !== val);
    } else {
      return [...array, val];
    }
  }

  return (
    <div className="container">
      <input className="screen" value="What do you want to do?" />
      <div className="buttons">
        {range(days).map((day) => (
          <button
            className={done.includes(day) ? "button button__active" : "button"}
            onClick={() => setDone(addOrRemove(done, day))}
          >
            <div className="button-text-wrapper">
              <span className="button-text">{day}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
