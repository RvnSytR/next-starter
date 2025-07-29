import {
  Action,
  allRoutes,
  appInfo,
  dashboardMenu,
  FileType,
  Menu,
  Route,
  RouteRole,
  routesMeta,
} from "../const";
import { Role } from "../permission";

export function getTitle(r: Route) {
  return `${routesMeta[r].displayName} | ${appInfo.name}`;
}

export function getActionLabel(action: Action) {
  if (action === "created") return "dibuat";
  if (action === "removed") return "dihapus";
  if (action === "updated") return "diperbarui";
  if (action === "uploaded") return "diunggah";
}

export function getFileTypeLabel(fileType: FileType) {
  if (fileType === "file") return "berkas";
  if (fileType === "image") return "gambar";
  if (fileType === "document") return "dokumen";
  if (fileType === "archive") return "arsip";
  if (fileType === "audio") return "audio";
  if (fileType === "video") return "video";
}

export function getRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function getRandomColor(withHash?: boolean) {
  const letters = "0123456789ABCDEF";
  let color = withHash ? "#" : "";
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
}

export function getMenuByRole(
  role: Role,
  menu: Menu[] = dashboardMenu,
): Menu[] {
  const filteredMenu = menu.map(({ section, content }) => {
    const filteredContent = content.filter(({ route }) => {
      const routeMeta = routesMeta[route];
      if (!("role" in routeMeta)) return true;

      const currentRole = routeMeta.role as RouteRole;
      return currentRole === "all" || currentRole.includes(role);
    });

    if (filteredContent.length <= 0) return null;
    else return { section, content: filteredContent } as Menu;
  });

  return filteredMenu.filter((item) => item !== null);
}

export function getActiveRoute(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const paths: string[] = [];

  for (let i = parts.length; i > 0; i--) {
    paths.push("/" + parts.slice(0, i).join("/"));
  }

  paths.push("/");
  for (const p of paths) {
    const activeRoute = allRoutes.find((item) => item === p);
    if (activeRoute) return activeRoute;
  }
}
