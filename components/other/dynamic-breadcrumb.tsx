"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Route, routesMeta } from "@/lib/const";
import Link from "next/link";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type DynamicBreadcrumbMeta = { url: string; displayName: string };
type DynamicBreadcrumbData = Route | DynamicBreadcrumbMeta;
export type DynamicBreadcrumbProps = {
  breadcrumb?: DynamicBreadcrumbData[];
  currentPage: string;
};

function getProps(data: DynamicBreadcrumbData): DynamicBreadcrumbMeta {
  return typeof data === "string"
    ? { url: data, displayName: routesMeta[data].displayName }
    : data;
}

export function DynamicBreadcrumb({
  breadcrumb,
  currentPage,
}: DynamicBreadcrumbProps) {
  const isMobile = useIsMobile();
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumb?.map((item, index) => {
          const { url, displayName } = getProps(item);
          if (isMobile && index !== 0) return;

          return (
            <Fragment key={index}>
              <BreadcrumbItem className="shrink-0">
                <BreadcrumbLink asChild>
                  <Link href={url} className="link">
                    {displayName}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </Fragment>
          );
        })}

        {breadcrumb && breadcrumb.length > 2 && (
          <>
            <BreadcrumbItem className="mx-0.5 md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <BreadcrumbEllipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {breadcrumb?.map((item, index) => {
                    const { url, displayName } = getProps(item);
                    if (isMobile && index === 0) return;

                    return (
                      <DropdownMenuItem key={index} asChild>
                        <Link href={url}>{displayName}</Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>

            <BreadcrumbSeparator className="md:hidden">/</BreadcrumbSeparator>
          </>
        )}

        <BreadcrumbItem>
          <BreadcrumbPage className="line-clamp-1 cursor-default text-ellipsis">
            {currentPage}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
