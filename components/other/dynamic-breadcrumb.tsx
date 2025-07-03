import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Route, routesMeta } from "@/lib/const";
import Link from "next/link";
import { Fragment } from "react";

type DynamicBreadcrumbLink = { url: string; displayName: string };
export type DynamicBreadcrumbProps = {
  breadcrumb?: (Route | DynamicBreadcrumbLink)[];
  currentPage: string;
};

export function DynamicBreadcrumb({
  breadcrumb,
  currentPage,
}: DynamicBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-nowrap">
        {breadcrumb?.map((item, index) => {
          const { url, displayName }: DynamicBreadcrumbLink =
            typeof item === "string"
              ? { url: item, displayName: routesMeta[item].displayName }
              : item;

          return (
            <Fragment key={index}>
              <BreadcrumbItem className="hidden shrink-0 md:flex">
                <BreadcrumbLink asChild>
                  <Link href={url}>{displayName}</Link>
                </BreadcrumbLink>
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
