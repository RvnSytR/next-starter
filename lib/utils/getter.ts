import { dashboardMenu, Menu, routeMetadata } from "../const";
import { Role } from "../permission";

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
  role: string,
  menu: Menu[] = dashboardMenu,
): Menu[] {
  const res = menu.map(({ section, content }) => {
    const filteredMenuContent = content.filter(({ route }) => {
      const { role: routeRole } = routeMetadata[route];
      return (
        routeRole && (routeRole === "all" || routeRole.includes(role as Role))
      );
    });
    if (filteredMenuContent.length <= 0) return null;
    else return { section, content: filteredMenuContent } as Menu;
  });
  return res.filter((section) => section !== null);
}
