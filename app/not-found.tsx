import { CustomButton } from "@/components/custom/custom-button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 md:gap-2">
      <div className="flex flex-col items-center gap-x-4 md:flex-row">
        <h1 className="animate-fade-right text-9xl">404</h1>

        <h1 className="animate-fade-left text-center leading-tight lg:text-start">
          Oops, looks like
          <br />
          there&apos;s nobody here!
        </h1>
      </div>

      <div className="animate-fade-up">
        <CustomButton
          customType="link"
          href="/"
          size="lg"
          variant="outline"
          className="hover:border-primary h-16 gap-4 rounded-full border-4 px-8 text-xl font-bold [&_svg]:size-5"
          text="Go To Main Page"
          withLoading
        />
      </div>
    </main>
  );
}
