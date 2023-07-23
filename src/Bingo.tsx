import { mulberry32, sample } from "./Utils";
import React from "react";
import './Bingo.css';
import { Options } from "./Selectors";

interface Mission {
  name: string;
  description: string;
  link?: string;
}

interface BingoProps {
  missions: Mission[];
  seed?: number;
  options: Options;
}

function BingoCell(props: { mission: Mission }) {
  const [showDescription, setShowDescription] = React.useState(false);
  const [completed, setCompleted] = React.useState(props.mission.name.toLowerCase().startsWith("never"));
  return <>
    <td className="mission"
        onMouseEnter={() => setShowDescription(true)}
        onMouseLeave={() => setShowDescription(false)}
        onClick={() => setCompleted(!completed)}
        style={{ backgroundColor: completed ? 'green' : 'inherit' }}
    >
      <div className="missionName">{props.mission.name}</div>
      {props.mission.description && <div className="missionDescription"
                                         onClick={e => e.stopPropagation()}
                                         style={{ display: showDescription ? 'block' : 'none' }}
      >
        {props.mission.description} {props.mission.link &&
        <a href={props.mission.link} target="_blank" rel="noreferrer">Link</a>}
      </div>}
    </td>
  </>;
}

export function BingoBoard(props: BingoProps) {
  const existingMissions = new Set();
  const prng = mulberry32(props.seed || 0);
  const rows = [];
  for (let i = 0; i < 5; i++) {
    const cols = [];
    for (let j = 0; j < 5; j++) {
      if (i === 2 && j === 2 && props.options.freeSpace) {
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
