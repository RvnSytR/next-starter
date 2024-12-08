import { Fragment } from "react";
import { GetMenu, LABEL } from "../content";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export type DynamicBreadcrumbProps = {
  breadcrumb?: string[];
  currentPage: string;
};

export function DynamicBreadcrumb({
  breadcrumb,
  currentPage,
}: DynamicBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumb?.map((item, index) => {
          const menu = GetMenu(item);
          const content = menu ? (
            <BreadcrumbLink href={menu.href}>{menu.label}</BreadcrumbLink>
          ) : (
            <BreadcrumbPage className="text-destructive">
              {LABEL.error.breadcrumb}
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
