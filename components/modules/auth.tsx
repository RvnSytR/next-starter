"use client";

import { signOut } from "@/lib/auth-client";
import { label } from "@/lib/content";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CustomButton } from "../custom/custom-button";

export function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <CustomButton
      icon={<LogOut />}
      variant="outline_destructive"
      text={label.button.signOut}
      loading={isLoading}
      //   inSidebar
      onClick={() =>
        signOut({
          fetchOptions: {
            onRequest: () => setIsLoading(true),
            onSuccess: () => {
              toast.success(label.toast.success.signOut);
              router.push("/login");
            },
            onError: ({ error }) => {
              setIsLoading(false);
              toast.error(error.message);
            },
          },
        })
      }
    />
  );
}
