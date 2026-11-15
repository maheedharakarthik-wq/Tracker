export interface Project {
    id: string;
    title: string;
    description: string;
    image: string;
    link: string;
    tags: string[];
}

export const projects: Project[] = [
    {
        id: "artgram",
        title: "Artgram – Your Hobby Lobby",
        description: "A full-fledged creative studio website built to showcase workshops, events, and multiple studio locations. The platform highlights hands-on activities, birthday & corporate events, real-time engagement, and seamless navigation across services.",
        image: "/assets/artgram_thumbnail.png",
        link: "https://artgram.in",
        tags: ["Creative Studio", "Events", "Web Design"],
    },
    {
        id: "ruhi-flavours",
        title: "Ruhi Flavours — Artisan Food Brand",
        description: "A modern e-commerce website for a traditional food brand, showcasing authentic veg & non-veg pickles, sweets, spices, and homemade products with a clean, premium visual identity.",
        image: "/assets/ruhiflavours_thumbnail.png",
        link: "https://ruhiflavours.com",
        tags: ["E-commerce", "Food & Beverage", "Branding"],
    },
    {
        id: "nexlytiq-technologies",
        title: "NexlytiQ Technologies — Online IT & Data Engineering",
        description: "An advanced online training institute platform offering specialized programs in Python, Data Engineering, SQL, Power BI, AWS, Azure, and Generative AI. We serve as their technical partners, delivering scalable web systems, student lead acquisition, and digital marketing.",
        image: "/assets/nexlytiq.jpg",
        link: "https://nexlytiqtechnologies.com",
        tags: ["EdTech", "Data Engineering", "Technical Partner", "Digital Marketing"],
    },
    {
        id: "magvin-developers",
        title: "Magvin Developers — Real Estate & Property Development",
        description: "A premium real estate platform developed for Magvin Developers to showcase luxury residential and commercial properties with immersive project showcases, lead generation, and inquiry management.",
        image: "/assets/magvin.png",
        link: "https://magvindevelopers.com/",
        tags: ["Real Estate", "Web Platform", "Lead Generation"],
    },
    {
        id: "ask-associates",
        title: "Ask Associates — Civil Engineering & Construction Consulting",
        description: "A professional corporate website developed for Ask Associates showcasing civil engineering expertise, construction consulting services, project portfolio, and business capabilities.",
        image: "/assets/ask.png",
        link: "https://askassociates45.com",
        tags: ["Civil Engineering", "Construction", "Corporate Website"],
    },
    {
        id: "folk-gokula-kshetram",
        title: "Folk Gokula Kshetram — Temple ERP & Devotee App",
        description: "A comprehensive digital platform and Android application developed for Folk Gokula Kshetram to streamline temple administration, festival management, pilgrimage booking, and devotee services.",
        image: "/assets/logo.png",
        link: "https://play.google.com/store/apps/details?id=com.vmkedgemind.folk_gokula_kshetram&pcampaignid=web_share",
        tags: ["Mobile App", "Temple ERP", "Play Store"],
    }
];
