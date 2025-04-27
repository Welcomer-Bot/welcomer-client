export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <section className="h-screen">
            {children}
        </section>
    );
}