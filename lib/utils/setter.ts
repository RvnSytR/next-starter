import { appInfo, route, Route, routeMetadata } from "../const";

export function setTitle(r: Route) {
  return `${routeMetadata[r].displayName} | ${appInfo.name}`;
}

export function setProtectedSubRoute(r: Route) {
  return route.protected === "/" ? `/${r}` : `${route.protected}/${r}`;
}
