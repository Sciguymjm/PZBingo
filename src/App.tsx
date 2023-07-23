import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BingoBoard } from "./Bingo";
import {
  AreaSelector,
  DEFAULT_AREA,
  DEFAULT_OPTIONS,
  getAreas,
  getFromURL,
  Options,
  OptionSelector,
  SeedSelector,
} from "./Selectors";
import { populateOverallMissions } from "./Missions";
import { FAQ } from "./FAQ";
import { Col, Container, Row } from "react-bootstrap";
import { Footer } from "./Footer";
import { URLParams } from "./URLParams";

function randomSeed() {
  return Math.floor(Math.random() * 1000000000);
}

function App() {
  const [seed, setSeed] = React.useState(getFromURL(URLParams.SEED, randomSeed()));
  const areas = [DEFAULT_AREA].concat(getAreas());
  const [area, setArea] = React.useState(getFromURL(URLParams.AREA, 'Muldraugh'));
  const [options, setOptions] = React.useState<Options>({
    excludeNever: getFromURL(URLParams.EXCLUDE_MISSIONS, DEFAULT_OPTIONS.excludeNever),
    numberOfItems: getFromURL(URLParams.ITEM_COUNT, DEFAULT_OPTIONS.numberOfItems),
    numberOfLocations: getFromURL(URLParams.POIS_COUNT, DEFAULT_OPTIONS.numberOfLocations),
    freeSpace: getFromURL(URLParams.HAS_FREE_SPACE, DEFAULT_OPTIONS.freeSpace),
  });
  const TOTAL_MISSIONS = populateOverallMissions(area, seed, options);
  console.log("Number of missions: " + TOTAL_MISSIONS.length);
  return (
    <div className="App">
      <Container className="App-header">
        <Row>
          <Col xs={2} />
          <Col xs={6}>
            <BingoBoard missions={TOTAL_MISSIONS} seed={seed} options={options} />
          </Col>
          <Col xs={2}>
            <AreaSelector value={area} onChange={e => {
              setArea(e);
            }} areaNames={areas} />
            <SeedSelector value={seed}
                          onChange={e => {
                            setSeed(parseInt(e));
                          }}
                          onClick={() => {
                            let newSeed = randomSeed();
                            setSeed(newSeed);
                          }} />
            <br />
            <OptionSelector value={options} onChange={e => {
              setOptions(e);
            }} />
          </Col>
          <Col xs={2} />
        </Row>
        <FAQ />
        <Footer />
      </Container>
    </div>
  );
}

export default App;
