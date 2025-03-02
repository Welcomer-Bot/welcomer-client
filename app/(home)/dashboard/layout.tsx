export default function Layout({children}: {children: React.ReactNode}) {
    return (
      <section className="container mx-auto max-w-7xl pt-16 px-6 ">
        {children}
      </section>
    );
}