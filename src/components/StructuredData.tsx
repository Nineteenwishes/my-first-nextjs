// Step 6: Structured Data (JSON-LD)
export default function StructuredData() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Akbar Maulana",
        url: "https://portofolio-akbarr.vercel.app",
        jobTitle: "Web Developer",
        description:
            "Web developer yang fokus membangun produk digital yang cepat, bersih, dan memberikan pengalaman pengguna terbaik.",
        knowsAbout: [
            "Next.js",
            "React",
            "TypeScript",
            "Tailwind CSS",
            "Frontend Development",
        ],
        worksFor: {
            "@type": "Organization",
            name: "Ashari Tech",
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
