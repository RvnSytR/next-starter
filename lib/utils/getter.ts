import {
  appInfo,
  dashboardMenu,
  Menu,
  Route,
  RouteRole,
  routesMetadata,
} from "../const";
import { Role } from "../permission";

export function getTitle(r: Route) {
  return `${routesMetadata[r].displayName} | ${appInfo.name}`;
}

export function getUrl() {
  const { isProduction, origin } = appInfo;
  return isProduction ? origin.prod : origin.dev;
}

export function getRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result as string;
}

export function getRandomColor(withHash?: boolean) {
  const letters = "0123456789ABCDEF";
  let color = withHash ? "#" : "";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color as string;
}

export function getMenuByRole(
  role: Role,
  menu: Menu[] = dashboardMenu,
): Menu[] {
  const filteredMenu = menu.map(({ section, content }) => {
    const filteredContent = content.filter(({ route }) => {
      const meta = routesMetadata[route];
      if ("role" in meta) {
        const currentRole = meta.role as RouteRole;
        return currentRole === "all" || currentRole.includes(role as Role);
      } else return true;
    });

    if (filteredContent.length <= 0) return null;
    else return { section, content: filteredContent } as Menu;
  });

  return filteredMenu.filter((item) => item !== null);
}
