export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <section className="container mx-auto px-4 h-full">
            {children}
        </section>
    );
}