import { label } from "@/lib/content";
import type { ActionResponse } from "@/server/action";
import type { ReactNode } from "react";
import { toast } from "sonner";

export function ToastAction(
  action: Promise<ActionResponse>,
  data: {
    loading?: ReactNode;
    success: (res: ActionResponse) => ReactNode;
    error?: () => void;
  },
) {
  const { loading, success, error } = data;
  toast.promise(action, {
    loading: loading ?? label.toast.loading.default,
    success: (res) => {
      if (!res.success) throw new Error(res.message);
      return success(res);
    },
    error: (e: Error) => {
      if (error) error();
      return e.message;
    },
  });
}
