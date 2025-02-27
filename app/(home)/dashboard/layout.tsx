export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <section className="container mx-auto px-4">
            {children}
        </section>
    );
}