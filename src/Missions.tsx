import OVERLAYS from "./data/overlays.json";
import { mulberry32, sample } from "./Utils";
import MISSIONS from "./data/missions.json";
import ITEMS from "./data/items.json";
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

const getItems = () => {
  return ITEMS;
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
    description: ` `,
    link: poi.url
  }));
  const items = getItems();
  const itemPRNG = mulberry32(seed);
  // sample 5 random items
  const randomItems = [];
  for (let i = 0; i < 5; i++) {
    const item = sample(itemPRNG, items);
    randomItems.push(item);
  }
  const ITEM_MISSIONS = randomItems.map(item => ({
    name: `Obtain ${item}.`,
    description: ``,
  }));


  return MISSIONS.concat(CLEAR_MISSIONS).concat(ITEM_MISSIONS);
}
