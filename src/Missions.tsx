import OVERLAYS from "./overlays.json";
import { mulberry32, sample } from "./Utils";
import MISSIONS from "./missions.json";
import { DEFAULT_AREA } from "./Selectors";

const getPOIs = (area: string = DEFAULT_AREA, zoomLevel: number = 2000) => {
  // return all of the POI names from OVERLAYS, as well as their PZ map coordinates as a url,
  // like https://map.projectzomboid.com/#10380x8807x441 where 441 is the zoom level
  return OVERLAYS.areas.filter(a => area === DEFAULT_AREA || a.name === area)
    .flatMap(area => area.pois.map(poi => ({
      name: `${poi.name} (${area.name})`,
      url: `https://map.projectzomboid.com/#${poi.x}x${poi.y}x${zoomLevel}`
    })));
};

export function populateOverallMissions(area: string, seed: number) {
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
  return MISSIONS.concat(CLEAR_MISSIONS);
}
