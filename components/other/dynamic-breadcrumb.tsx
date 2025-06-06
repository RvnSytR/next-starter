import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Route, routeMetadata } from "@/lib/const";
import Link from "next/link";
import { Fragment } from "react";

export type DynamicBreadcrumbProps = {
  breadcrumbArr?: (Route | { path: string; displayName: string })[];
  currentPage: string;
};

export function DynamicBreadcrumb({
  breadcrumbArr,
  currentPage,
}: DynamicBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-nowrap">
        {breadcrumbArr?.map((item, index) => {
          const menu = typeof item === "string" ? routeMetadata[item] : item;
          const content = menu ? (
            <BreadcrumbLink asChild>
              <Link href={menu.path}>{menu.displayName}</Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage className="text-destructive">
              Invalid route!
            </BreadcrumbPage>
          );

          return (
            <Fragment key={index}>
              <BreadcrumbItem className="hidden shrink-0 md:flex">
                {content}
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:flex">
                /
              </BreadcrumbSeparator>
            </Fragment>
          );
        })}

        <BreadcrumbItem>
          <BreadcrumbPage className="line-clamp-1 cursor-default text-ellipsis">
            {currentPage}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
