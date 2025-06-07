import { appInfo, Route, routeMetadata } from "../const";

export function setTitle(route: Route) {
  return `${routeMetadata[route].displayName} | ${appInfo.name}`;
}
