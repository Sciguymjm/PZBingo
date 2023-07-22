import React from "react";
import OVERLAYS from "./overlays.json";

export const DEFAULT_AREA = 'All';
export const getAreas = () => {
  return OVERLAYS.areas.map(area => area.name);
};

export function AreaSelector(props: {
  value: string,
  onChange: (e: any) => void,
  areaNames: string[]
}) {
  return <div className={"area"}>
    <label htmlFor="area">Area:</label>
    <select id="area" value={props.value} onChange={props.onChange}>
      {props.areaNames.map(area => <option key={area} value={area}>{area}</option>)}
    </select>
  </div>;
}

export function SeedSelector(props: { value: number, onChange: (e: any) => void, onClick: () => void }) {
  return <div className="seed">
    <label htmlFor="seed">Seed:</label>
    <input type="number" id="seed" value={props.value} onChange={props.onChange} />
    <button onClick={props.onClick}>Random</button>
    <button onClick={() => navigator.clipboard.writeText(
      `${window.location.href}`
    )}>Copy URL
    </button>
  </div>;
}

export const getSeedFromURL = () => {
  const url = new URL(window.location.href);
  const seed = url.searchParams.get('seed');
  return seed ? parseInt(seed) : 0;
};
export const getAreaFromURL = () => {
  const url = new URL(window.location.href);
  const area = url.searchParams.get('area');
  return area || DEFAULT_AREA;
};

export function setAreaURLParam(e: any) {
  const url = new URL(window.location.href);
  url.searchParams.set('area', e);
  window.history.replaceState({}, '', url.toString());
}

export function setSeedURLParam(newSeed: number) {
  const url = new URL(window.location.href);
  url.searchParams.set('seed', newSeed.toString());
  window.history.replaceState({}, '', url.toString());
}

