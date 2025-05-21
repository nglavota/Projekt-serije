import ShowNav from "@/app/components/ShowNav";

export default async function ShowLayout({ children, params }) {
  const { id } = await params;

  return (
    <>
      <ShowNav id={id} />
      <section className="max-w-6xl mx-auto w-full p-6">
        {children}
      </section>
    </>
  );
}
