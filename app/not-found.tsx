import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyTitle,
} from "@/components/ui/empty";
import Link from "next/link";

export default function NotFound() {
  return (
    <Empty className="min-h-dvh">
      <EmptyTitle>404 - Not Found</EmptyTitle>
      <EmptyDescription>
        Oops, Looks like there&apos;s no one here.
      </EmptyDescription>
      <EmptyContent>
        <Link href="/" className="link">
          Take me Home
        </Link>
      </EmptyContent>
    </Empty>
  );
}
