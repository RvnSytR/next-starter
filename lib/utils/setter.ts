import { appInfo, Route, routeMetadata } from "../const";

export function setTitle(r: Route) {
  return `${routeMetadata[r].displayName} | ${appInfo.name}`;
}
