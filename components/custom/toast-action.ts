import type { Action } from "@/server/action";
import { toast } from "sonner";
import { label } from "../content";

export function ToastAction(
  action: Action,
  data: {
    loading?: React.ReactNode;
    success: () => React.ReactNode;
    error?: () => void;
  },
) {
  const { loading, success, error } = data;

  toast.promise(action, {
    loading: loading ?? label.toast.loading.default,
    success: (res) => {
      if (!res.status) throw new Error(res.message);
      return success();
    },
    error: (e: Error) => {
      if (error) error();
      return e.message;
    },
  });
}
