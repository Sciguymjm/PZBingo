import React from 'react';
import './App.css';
import { BingoBoard } from "./Bingo";
import {
  AreaSelector,
  DEFAULT_AREA,
  getAreaFromURL,
  getAreas,
  getSeedFromURL,
  SeedSelector,
  setAreaURLParam,
  setSeedURLParam
} from "./Selectors";
import { populateOverallMissions } from "./Missions";

function App() {
  const [seed, setSeed] = React.useState(getSeedFromURL());
  const areas = [DEFAULT_AREA].concat(getAreas());
  const [area, setArea] = React.useState(getAreaFromURL());
  const TOTAL_MISSIONS = populateOverallMissions(area, seed);
  return (
    <div className="App">
      <header className="App-header">
        <BingoBoard missions={TOTAL_MISSIONS} seed={seed} />
        <SeedSelector value={seed} onChange={e => setSeed(parseInt(e.target.value))}
                      onClick={() => {
                        let newSeed = Math.floor(Math.random() * 1000000000);
                        setSeed(newSeed);
                        setSeedURLParam(newSeed);
                      }} />
        <AreaSelector value={area} onChange={e => {
          setArea(e.target.value);
          setAreaURLParam(e.target.value);
        }} areaNames={areas} />
      </header>
    </div>
  );
}

export default App;
