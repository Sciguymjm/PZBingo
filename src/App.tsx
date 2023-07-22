import React, { useEffect } from 'react';
import './App.css';
import MISSIONS from './missions.json';
import OVERLAYS from './overlays.json';

const MISSIONS_TOTAL = MISSIONS;

// add "Clear <location>" missions

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
  link?: string;
}

interface BingoProps {
  missions: Mission[];
  seed?: number;
}

// on hover show a box with the mission description
// original <td className="mission">{props.mission.name}</td>
function BingoCell(props: { mission: Mission }) {
  const [showDescription, setShowDescription] = React.useState(false);
  const [completed, setCompleted] = React.useState(false);
  return <>
    <td className="mission"
        onMouseEnter={() => setShowDescription(true)}
        onMouseLeave={() => setShowDescription(false)}
        onClick={() => setCompleted(!completed)}
        style={{ backgroundColor: completed ? 'green' : 'inherit' }}
    >
      <div className="missionName">{props.mission.name}</div>
      <div className="missionDescription"
           onClick={e => e.stopPropagation()}
           style={{ display: showDescription ? 'block' : 'none' }}
      >
        {props.mission.description} {props.mission.link &&
        <a href={props.mission.link} target="_blank" rel="noreferrer">Map</a>}
      </div>
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
        cols.push(<td key="freeSpace" className="mission" style={{ backgroundColor: 'green' }}>Free Space</td>);
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

const getPOIs = (area: string = 'All') => {
  // return all of the POI names from OVERLAYS, as well as their PZ map coordinates as a url,
  // like https://map.projectzomboid.com/#10380x8807x441 where 441 is the zoom level
  return OVERLAYS.areas.filter(a => area === 'All' || a.name === area)
    .flatMap(area => area.pois.map(poi => ({
    name: `${poi.name} (${area.name})`,
    url: `https://map.projectzomboid.com/#${poi.x}x${poi.y}x2000`
  })));
};

const getAreas = () => {
  return OVERLAYS.areas.map(area => area.name);
};

function App() {
  const [seed, setSeed] = React.useState(0);
  const areas = ['All'].concat(getAreas());
  const [area, setArea] = React.useState(areas[0]);
  const pois = getPOIs(area);
  const poiPRNG = mulberry32(seed);
  // sample 10 random pois
  const randomPOIs = [];
  for (let i = 0; i < 10; i++) {
    const poi = sample(poiPRNG, pois);
    randomPOIs.push(poi);
  }
  // add "Clear <location>" missions to total missions
  const CLEAR_MISSIONS = randomPOIs.map(poi => ({
    name: `Clear ${poi.name}`,
    description: `Clear ${poi.name}`,
    link: poi.url
  }));
  const TOTAL_MISSIONS = MISSIONS.concat(CLEAR_MISSIONS);
  return (
    <div className="App">
      <header className="App-header">
        <BingoBoard missions={TOTAL_MISSIONS} seed={seed} />
        <div className="seed">
          <label htmlFor="seed">Seed:</label>
          <input type="number" id="seed" value={seed} onChange={e => setSeed(parseInt(e.target.value))} />
          <button onClick={() => setSeed(Math.floor(Math.random() * 1000000000))}>Random</button>
        </div>
        <div className={"area"}>
          <label htmlFor="area">Area:</label>
          <select id="area" value={area} onChange={e => setArea(e.target.value)}>
            {areas.map(area => <option key={area} value={area}>{area}</option>)}
          </select>
        </div>
      </header>
    </div>
  );
}

export default App;
