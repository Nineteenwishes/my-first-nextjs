// Step 5: Robots
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        sitemap: "https://portofolio-akbarr.vercel.app/sitemap.xml",
    };
}
