import React from "react";
import "./App.css";
import { setupAudio } from "./setupAudio";

function PitchReadout({ running, latestPitch }) {
  return (
    <div className="PitchReadout">
      {latestPitch
        ? `Latest pitch: ${latestPitch.toFixed(1)} Hz`
        : running
        ? "Listening..."
        : "Paused"}
    </div>
  );
}

function AudioPlayerControl() {
  const [audio, setAudio] = React.useState();
  const [running, setRunning] = React.useState(false);
  const [latestPitch, setLatestPitch] = React.useState(undefined);

  // Initial state. Initialize the web audio once a user gesture on the page
  // has been registered.
  if (!audio) {
    return (
      <button
        onClick={async () => {
          setAudio(await setupAudio(setLatestPitch));
          setRunning(true);
        }}
      >
        Start listening
      </button>
    );
  }

  // Audio already initialized. Suspend / resume based on its current state.
  const { context } = audio;
  return (
    <div>
      <PitchReadout running={running} latestPitch={latestPitch} />
      <button
        onClick={async () => {
          if (running) {
            await context.suspend();
            setRunning(context.state === "running");
          } else {
            await context.resume();
            setRunning(context.state === "running");
          }
        }}
        disabled={context.state !== "running" && context.state !== "suspended"}
      >
        {running ? "Pause" : "Resume"}
      </button>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AudioPlayerControl />
      </header>
    </div>
  );
}

export default App;
