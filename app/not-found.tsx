import { LinkLoader } from "@/components/other/buttons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-y-4 mask-radial-from-75% mask-alpha">
      <p className="text-xl font-light">404 | Halaman Tidak Ditemukan</p>

      <Button variant="link" className="font-light" asChild>
        <Link href="/">
          <LinkLoader /> Kembali ke Halaman Utama
        </Link>
      </Button>
    </div>
  );
}
