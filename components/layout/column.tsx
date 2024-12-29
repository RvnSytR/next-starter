// import { ColumnDef } from "@tanstack/react-table";

import { type ButtonProps, Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";

export const HeaderButton = ({ children, ...props }: ButtonProps) => {
  return (
    <Button size="sm" variant="ghost" className="w-full" {...props}>
      {children}
      <ArrowUpDown />
    </Button>
  );
};
