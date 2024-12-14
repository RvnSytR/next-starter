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
import Link from "next/link";

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
              <BreadcrumbItem>{content}</BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </Fragment>
          );
        })}
        <BreadcrumbItem>
          <BreadcrumbPage>{currentPage}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
