import { SignIn } from "@/components/signinButton";

export default async function Error({
  searchParams,
}: {
  searchParams: Promise<{ [error: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const error = params.error;
  let error_description =
    params.error_description ?? "An unknown error as occured";

  if (!error) {
    error_description =
      "There's no error there, why are you trying to get errors ?!!";
  }

  return (
    <section className="flex flex-col h-full items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <h1 className="font-bold mb-7">There was an error :(</h1>
        <p className="mb-5">{error_description}</p>
        <SignIn text="Try again" />
      </div>
    </section>
  );
}
