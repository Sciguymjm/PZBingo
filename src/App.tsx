import React from 'react';
import './App.css';
import MISSIONS from './missions.json';

// create a random generator with a seed
// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
function mulberry32(a: number) {
  return function () {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// sample using mulberry32
function sample<T>(rng: () => number, arr: T[]): T {
  const i = Math.floor(rng() * arr.length);
  return arr[i];
}

interface Mission {
  name: string;
  description: string;
}

interface BingoProps {
  missions: Mission[];
  seed?: number;
}

// on hover show a box with the mission description
// original <td className="mission">{props.mission.name}</td>
function BingoCell(props: { mission: Mission }) {
  const [showDescription, setShowDescription] = React.useState(false);
  return <>
    <td className="mission"
        onMouseEnter={() => setShowDescription(true)}
        onMouseLeave={() => setShowDescription(false)}
    >
      <div className="missionName">{props.mission.name}</div>
      <div className="missionDescription" style={{ display: showDescription ? 'block' : 'none' }}
      >{props.mission.description}</div>
    </td>
  </>;
}

function BingoBoard(props: BingoProps) {
  const existingMissions = new Set();
  const prng = mulberry32(props.seed || 0);
  const rows = [];
  for (let i = 0; i < 5; i++) {
    const cols = [];
    for (let j = 0; j < 5; j++) {
      // free space
      if (i === 2 && j === 2) {
        cols.push(<td key="freeSpace" className="mission">Free Space</td>);
        continue;
      }
      let mission = sample(prng, props.missions);
      // make sure we don't have duplicates
      while (existingMissions.has(mission.name)) {
        mission = sample(prng, props.missions);
      }
      cols.push(<BingoCell key={mission.name} mission={mission} />);
      existingMissions.add(mission.name);
    }
    rows.push(<tr key={i}>{cols}</tr>);
  }
  return (
    <div className="bingoBoard">
      <table>
        <tbody>
        {rows}
        </tbody>
      </table>
    </div>
  );

}


function App() {
  const [seed, setSeed] = React.useState(0);
  return (
    <div className="App">
      <header className="App-header">
        <BingoBoard missions={MISSIONS} seed={seed} />
        <div className="seed">
          <label htmlFor="seed">Seed:</label>
          <input type="number" id="seed" value={seed} onChange={e => setSeed(parseInt(e.target.value))} />
          <button onClick={() => setSeed(Math.floor(Math.random() * 1000000000))}>Random</button>
        </div>
      </header>
    </div>
  );
}

export default App;
