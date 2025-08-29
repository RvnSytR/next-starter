import { Button } from "@/components/ui/button";
import { LinkLoader } from "@/components/ui/buttons";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-y-4 mask-radial-from-75% mask-alpha">
      <p className="text-2xl font-light">404 | Halaman Tidak Ditemukan</p>
      <Button variant="link" className="font-light" asChild>
        <Link href="/">
          <LinkLoader /> Kembali ke Beranda
        </Link>
      </Button>
    </div>
  );
}
