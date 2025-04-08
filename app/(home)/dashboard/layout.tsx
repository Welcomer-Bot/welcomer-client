export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <section className="pt-32 min-h-screen">
            {children}
        </section>
    );
}