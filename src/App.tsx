import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BingoBoard } from "./Bingo";
import {
  AreaSelector,
  DEFAULT_AREA,
  getAreas, getFromURL,
  SeedSelector,
} from "./Selectors";
import { populateOverallMissions } from "./Missions";
import { FAQ } from "./FAQ";
import { Col, Container, Row } from "react-bootstrap";

function App() {
  const [seed, setSeed] = React.useState(getFromURL('seed', 0));
  const areas = [DEFAULT_AREA].concat(getAreas());
  const [area, setArea] = React.useState(getFromURL('area', 'All'));
  const TOTAL_MISSIONS = populateOverallMissions(area, seed);
  return (
    <div className="App">
      <Container className="App-header">
        <Row>
          <Col xs={2} />
          <Col xs={6}>
            <BingoBoard missions={TOTAL_MISSIONS} seed={seed} />
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
                            let newSeed = Math.floor(Math.random() * 1000000000);
                            setSeed(newSeed);
                          }} />
          </Col>
          <Col xs={2} />
        </Row>
        <FAQ />
      </Container>
    </div>
  );
}

export default App;
