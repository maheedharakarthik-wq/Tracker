
import { Cog, Cloud, Globe, Smartphone, BrainCircuit, Megaphone } from "lucide-react";

export interface SubService {
    title: string;
    description: string;
    iconName?: string;
    features?: string[];
}

export interface Service {
    slug: string;
    title: string;
    description: string;
    shortDescription: string;
    iconName: string; // We'll map this in the component
    features: string[];
    image: string;
    badge?: string;
    crmHighlight?: {
        title: string;
        tagline: string;
        description: string;
        benefits: string[];
    };
    subServices?: SubService[];
}

export const services: Service[] = [
    {
        slug: "software-development",
        title: "Custom Software Development",
        shortDescription: "End-to-end software solutions tailored to meet unique client requirements.",
        description: "We build robust, scalable, and future-proof software solutions. From enterprise resource planning (ERP) systems to custom workflow automation tools, our software maximizes efficiency and drives growth.",
        iconName: "Cog",
        features: ["Enterprise Software", "SaaS Development", "Legacy Modernization", "API Integration"],
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop"
    },
    {
        slug: "web-development",
        title: "Modern Web Development",
        shortDescription: "High-performance web applications built with modern frameworks and speed.",
        description: "Crafting digital experiences that captivate and convert. We specialize in building responsive, high-speed, and SEO-optimized web applications using modern frameworks like Next.js, React, and Tailwind CSS.",
        iconName: "Globe",
        features: ["SPA & PWA Development", "E-commerce Platforms", "CMS Solutions", "Performance Optimization"],
        image: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1000&auto=format&fit=crop"
    },
    {
        slug: "mobile-development",
        title: "Mobile App Development",
        shortDescription: "Native and cross-platform mobile apps for iOS and Android platforms.",
        description: "Reach your customers wherever they are. We design and develop intuitive mobile applications that deliver seamless user experiences across all devices, leveraging React Native and Flutter.",
        iconName: "Smartphone",
        features: ["iOS & Android Apps", "Cross-Platform Development", "UI/UX Design", "App Store Optimization"],
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000&auto=format&fit=crop"
    },
    {
        slug: "digital-marketing",
        title: "Digital Marketing & CRM",
        badge: "Includes Custom CRM",
        shortDescription: "Full-funnel growth marketing with ads, SEO, social media, and custom CRM dashboards.",
        description: "Scale your revenue and brand authority with full-suite digital marketing paired with our proprietary custom CRM dashboards. From high-converting Meta and Google ad campaigns to viral reels, search engine optimization, dedicated telecalling conversion systems, and real-time lead analytics, we manage your entire customer journey from first click to final close.",
        iconName: "Megaphone",
        features: [
            "Custom CRM & Live Lead Tracking Dashboard",
            "Performance Marketing (Meta & Google Ads)",
            "Search Engine Optimization (SEO & Local GMB)",
            "Social Media Management & Viral Reel Creation",
            "Creative Graphic Posters & Ad Copywriting",
            "Telecalling & Sales Lead Conversion Support",
            "Omnichannel Automation (WhatsApp & Email)",
            "Conversion Rate Optimization (CRO) & Analytics"
        ],
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
        crmHighlight: {
            title: "Custom CRM & Lead Tracking Dashboard",
            tagline: "Stop losing leads in messy spreadsheets. Take full control of your sales pipeline.",
            description: "Every digital marketing campaign we run is supported by our bespoke CRM dashboard. Your sales team gets instant lead alerts, can assign telecallers, log customer interactions, and track conversion stages—giving you 100% transparency on ad spend and revenue return.",
            benefits: [
                "Instant lead capture synchronized directly from Meta Ads, Google Ads, and landing pages",
                "Centralized pipeline view: New Leads, Contacted, In-Followup, Converted, and Closed",
                "Telecaller management module with call logs, follow-up reminders, and customer notes",
                "Real-time Cost-Per-Lead (CPL) and Return on Ad Spend (ROAS) analytics",
                "Role-based access controls for admins, managers, and sales executives"
            ]
        },
        subServices: [
            {
                title: "Custom CRM & Lead Dashboard",
                description: "A centralized web and mobile portal customized for your business to track incoming inquiries in real-time, organize sales pipelines, and measure agent performance.",
                iconName: "LayoutDashboard",
                features: ["Real-time Lead Capture", "Telecaller Activity Tracker", "Pipeline Status Stages", "Conversion Analytics"]
            },
            {
                title: "Performance Marketing (Meta & Google Ads)",
                description: "Laser-focused paid advertising across Facebook, Instagram, Google Search, Display, and YouTube designed to deliver the lowest Cost-Per-Lead (CPL) and highest ROI.",
                iconName: "Target",
                features: ["Meta Ads (FB & Insta)", "Google Search & YouTube Ads", "A/B Testing & Audience Funnels", "Remarketing & Retargeting"]
            },
            {
                title: "Search Engine Optimization (SEO)",
                description: "Data-backed SEO campaigns that boost search engine rankings, capture high-intent buyers, and maintain top visibility on Google Search and Maps.",
                iconName: "TrendingUp",
                features: ["On-Page & Technical SEO", "Local SEO & Google Business Profile", "High-Intent Keyword Ranking", "Authority & Backlink Strategy"]
            },
            {
                title: "Social Media Management & Growth",
                description: "End-to-end management of your social channels with professional aesthetic design, content schedules, community interaction, and brand credibility.",
                iconName: "Share2",
                features: ["Content Calendar Planning", "Community & Comment Management", "Brand Voice & Visual Identity", "Monthly Engagement Reports"]
            },
            {
                title: "Creative Content & Reel Production",
                description: "Captivating visual content including viral short-form reels, professional video editing, high-converting ad posters, and scroll-stopping graphics.",
                iconName: "Video",
                features: ["Instagram Reels & Shorts Scripting", "Professional Video Editing", "Promotional Graphic Posters", "Product & Brand Showcases"]
            },
            {
                title: "Telecalling & Lead Conversion Services",
                description: "Trained telecalling specialists to promptly contact every inquiry, qualify high-value leads, follow up systematically, and drive conversions directly in your CRM.",
                iconName: "PhoneCall",
                features: ["Rapid Lead Contact", "Custom Sales Pitch Scripts", "Call Disposition & Follow-up Logs", "High Conversion Closing"]
            },
            {
                title: "Omnichannel Automation (WhatsApp & Email)",
                description: "Automate customer communication with instant WhatsApp responses, automated appointment reminders, and automated email nurturing sequences.",
                iconName: "MessageSquare",
                features: ["WhatsApp Business API Setup", "Automated Instant Replies", "Email Drip Campaigns", "Broadcast Notifications & Offers"]
            },
            {
                title: "Landing Pages & Conversion Rate Optimization",
                description: "Lightning-fast, mobile-first landing pages engineered specifically to convert ad visitors into verified inquiries and booked appointments.",
                iconName: "Globe",
                features: ["High-Converting Page Layouts", "Mobile-Optimized Experience", "Frictionless Inquiry Forms", "Heatmap & Conversion Tracking"]
            }
        ]
    },
    {
        slug: "ai-ml",
        title: "Artificial Intelligence & ML",
        shortDescription: "Data-driven insights, intelligent automation, and predictive machine learning.",
        description: "Unlock the power of your data. We implement machine learning models and AI algorithms to automate processes, predict trends, and enhance decision-making.",
        iconName: "BrainCircuit",
        features: ["Predictive Analytics", "Natural Language Processing", "Computer Vision", "AI Chatbots"],
        image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=1000&auto=format&fit=crop"
    },
    {
        slug: "iot-solutions",
        title: "Smart IoT Solutions",
        shortDescription: "Automated and integrated IoT solutions for homes, industries, and enterprises.",
        description: "Connecting the physical and digital worlds. Our IoT solutions empower businesses with real-time monitoring, predictive maintenance, and smart automation capabilities.",
        iconName: "Cloud",
        features: ["Smart Home/City", "Industrial IoT (IIoT)", "Remote Monitoring", "Embedded Systems"],
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop"
    }
];
