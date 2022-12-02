import Head from "next/head";
import { useEffect, useState } from "react";
// import styles from "../styles/Home.module.css";
import * as Tone from "tone";
import { useControls } from "leva";

// import Key from '../src/Key'

const keysMap = {
  // whites
  a: "C",
  s: "D",
  d: "E",
  f: "F",
  g: "G",
  h: "A",
  j: "B",
  // blacks
  w: "C#",
  e: "D#",
  t: "F#",
  y: "G#",
  u: "A#",
};

export default function Home() {
  const [keys, setKeys] = useState<string[]>([]);
  const [synth, setSynth] = useState<any>();
  const [start, setStart] = useState(false);

  console.log(start);

  const controls = useControls({
    octave: { value: 2, min: 0, max: 8, step: 1 },
    harmonicity: { value: 1, min: -2, max: 3, step: 0.5 },
    oscillator: {
      value: "fmsquare",
      options: [
        "sine",
        "square",
        "triangle",
        "sawtooth",
        "fatsine",
        "fatsquare",

        "fmsine",
        "fmsquare",
        "fmtriangle",
        "fmsawtooth",
      ],
    },
  });

  const envelopeControls = useControls("Envelope", {
    attack: { value: 0.8, min: 0, max: 2, step: 0.05 },
    decay: { value: 0.2, min: 0, max: 2, step: 0.1 },
    sustain: { value: 0.2, min: 0, max: 1, step: 0.1 },
    release: { value: 1.5, min: 0, max: 5, step: 0.5 },
  });

  useEffect(() => {
    if (!synth) return;

    synth.set({
      oscillator: {
        type: controls.oscillator,
        harmonicity: controls.harmonicity,
        // modulationType: "sine"
      },
      envelope: {
        attackCurve: "exponential",
        attack: envelopeControls.attack,
        decay: envelopeControls.decay,
        sustain: envelopeControls.sustain,
        release: envelopeControls.release,
      },
      portamento: 0.05,
    });
  }, [controls, envelopeControls]);

  useEffect(() => {
    if (!start) return;

    setSynth(
      new Tone.FMSynth({
        oscillator: {
          type: controls.oscillator,
          harmonicity: 1,
          modulationType: "sine",
        },
        envelope: {
          attackCurve: "exponential",
          attack: 0.8,
          decay: 0.2,
          sustain: 0.2,
          release: 1.5,
        },
        portamento: 0.05,
      }).toDestination()
    );

    function song(time: Tone.Unit.Time) {
      // Bars:Beats:Sixteenths
      let currentBeat = String(Tone.Transport.position).split(":");
      console.log(currentBeat);
      // let bar = currentBeat[0];
      let beat = currentBeat[1];

      if (["0", "2"].includes(beat)) {
        // bassSynth.triggerAttackRelease(1000, "8n", time, 1);
      }
      if (["0", "4"].includes(beat)) {
        //   // bassSynth.triggerAttackRelease('F#3', "8n", time, 1);
        // cymbalSynth.triggerAttackRelease('8n', time, 0.3)
      }

      console.log(beat);
    }

    // let loopBeat = new Tone.Loop(song, "16n");
    // let bassSynth = new Tone.MembraneSynth().toDestination();
    // let cymbalSynth = new Tone.MetalSynth().toDestination();
    // Tone.Transport.bpm.value = 140;
    // Tone.Transport.start();
    // loopBeat.start(0);
  }, [start]);

  function activateKey(key: string) {
    if (synth)
      synth.triggerAttackRelease(`${keysMap[key]}${controls.octave}`, "4n");
    setKeys((keys) => {
      return keys.indexOf(key) !== -1 ? keys : [...keys, key];
    });
  }

  function deactivateKey(key: string) {
    // if (synth) synth.triggerRelease();
    setKeys((keys) => keys.filter((k) => k !== key));
  }

  useEffect(() => {
    function downHandler({ key }: any) {
      if (synth)
        synth.triggerAttackRelease(`${keysMap[key]}${controls.octave}`, "4n");
      activateKey(key);
    }
    function upHandler({ key }: any) {
      // if (synth) synth.triggerRelease();
      deactivateKey(key);
    }

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [synth, controls]);

  return (
    <div className="background">
      {!start ? (
        <button onClick={() => setStart(true)}>Start</button>
      ) : (
        <main className="container">
          <div className="inside">
            <div className="keys">
              {["w", "e", "t", "y", "u"].map((key) => (
                <div
                  key={key}
                  className={keys.includes(key) ? "keyblackactive" : "keyblack"}
                  onMouseDown={() => activateKey(key)}
                  onMouseUp={() => deactivateKey(key)}
                />
              ))}
            </div>
            <div className="keys">
              {["a", "s", "d", "f", "g", "h", "j"].map((key) => (
                <div
                  key={key}
                  className={keys.includes(key) ? "keywhiteactive" : "keywhite"}
                  onMouseDown={() => activateKey(key)}
                  onMouseUp={() => deactivateKey(key)}
                />
              ))}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
