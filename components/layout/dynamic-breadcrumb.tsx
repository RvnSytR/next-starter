import Link from "next/link";
import { Fragment } from "react";
import { GetMenu, label } from "../content";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export type DynamicBreadcrumbProps = {
  breadcrumbArr?: string[];
  currentPage: string;
};

export function DynamicBreadcrumb({
  breadcrumbArr,
  currentPage,
}: DynamicBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbArr?.map((item, index) => {
          const menu = GetMenu(item);
          const content = menu ? (
            <BreadcrumbLink asChild>
              <Link href={menu.href}>{menu.label}</Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage className="text-destructive">
              {label.error.breadcrumb}
            </BreadcrumbPage>
          );

          return (
            <Fragment key={index}>
              <BreadcrumbItem className="hidden md:flex">
                {content}
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:flex">
                /
              </BreadcrumbSeparator>
            </Fragment>
          );
        })}

        <BreadcrumbItem>
          <BreadcrumbPage className="cursor-default">
            {currentPage}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
