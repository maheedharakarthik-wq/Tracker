import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("No DATABASE_URL found");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false },
});

async function migrate() {
  const client = await pool.connect();
  console.log("Connected to PostgreSQL database");

  try {
    await client.query("BEGIN");

    // 1. Add 'hr' and 'employee' to role enum
    console.log("Updating role enum...");
    await client.query(`
      ALTER TYPE role ADD VALUE IF NOT EXISTS 'hr';
      ALTER TYPE role ADD VALUE IF NOT EXISTS 'employee';
    `);

    // 2. CMS Projects table
    console.log("Creating cms_projects table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS cms_projects (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        category TEXT DEFAULT 'Web Development' NOT NULL,
        image_url TEXT NOT NULL,
        live_url TEXT,
        github_url TEXT,
        client_name TEXT,
        tags TEXT[] DEFAULT '{}' NOT NULL,
        is_featured BOOLEAN DEFAULT true NOT NULL,
        is_published BOOLEAN DEFAULT true NOT NULL,
        display_order INTEGER DEFAULT 0 NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS cms_projects_slug_idx ON cms_projects(slug);
      CREATE INDEX IF NOT EXISTS cms_projects_featured_idx ON cms_projects(is_featured);
      CREATE INDEX IF NOT EXISTS cms_projects_order_idx ON cms_projects(display_order);
    `);

    // 3. CMS Partners & Clients table
    console.log("Creating cms_partners table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS cms_partners (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT DEFAULT 'technical_partner' NOT NULL,
        logo_url TEXT NOT NULL,
        website_url TEXT,
        industry TEXT,
        description TEXT,
        is_active BOOLEAN DEFAULT true NOT NULL,
        display_order INTEGER DEFAULT 0 NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS cms_partners_category_idx ON cms_partners(category);
      CREATE INDEX IF NOT EXISTS cms_partners_active_idx ON cms_partners(is_active);
    `);

    // 4. CMS Landing Page Sections table
    console.log("Creating cms_sections table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS cms_sections (
        id SERIAL PRIMARY KEY,
        section_key TEXT NOT NULL UNIQUE,
        title TEXT,
        subtitle TEXT,
        badge_text TEXT,
        content_json JSONB DEFAULT '{}' NOT NULL,
        is_active BOOLEAN DEFAULT true NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    // 5. Job Postings table
    console.log("Creating job_postings table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS job_postings (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        department TEXT NOT NULL,
        location TEXT NOT NULL,
        type TEXT NOT NULL,
        experience TEXT,
        salary TEXT,
        description TEXT NOT NULL,
        requirements TEXT,
        responsibilities TEXT,
        is_active BOOLEAN DEFAULT true NOT NULL,
        posted_by TEXT REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS job_postings_slug_idx ON job_postings(slug);
      CREATE INDEX IF NOT EXISTS job_postings_active_idx ON job_postings(is_active);
      CREATE INDEX IF NOT EXISTS job_postings_dept_idx ON job_postings(department);
    `);

    // 6. Job Applications table
    console.log("Creating job_applications table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS job_applications (
        id SERIAL PRIMARY KEY,
        job_id INTEGER REFERENCES job_postings(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        resume_url TEXT NOT NULL,
        portfolio_url TEXT,
        cover_note TEXT,
        status TEXT DEFAULT 'pending' NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS job_applications_job_idx ON job_applications(job_id);
      CREATE INDEX IF NOT EXISTS job_applications_status_idx ON job_applications(status);
    `);

    // 7. Seed Initial Projects if empty
    const { rows: projCount } = await client.query("SELECT COUNT(*) FROM cms_projects");
    if (parseInt(projCount[0].count) === 0) {
      console.log("Seeding initial CMS projects...");
      const seedProjects = [
        {
          title: "Artgram – Your Hobby Lobby",
          slug: "artgram",
          description: "A full-fledged creative studio website built to showcase workshops, events, and multiple studio locations.",
          category: "Creative Studio",
          image_url: "/assets/artgram_thumbnail.png",
          live_url: "https://artgram.in",
          tags: ["Creative Studio", "Events", "Web Design"],
          order: 1
        },
        {
          title: "Ruhi Flavours — Artisan Food Brand",
          slug: "ruhi-flavours",
          description: "A modern e-commerce website for a traditional food brand, showcasing authentic veg & non-veg pickles, sweets, spices, and homemade products.",
          category: "E-commerce",
          image_url: "/assets/ruhiflavours_thumbnail.png",
          live_url: "https://ruhiflavours.com",
          tags: ["E-commerce", "Food & Beverage", "Branding"],
          order: 2
        },
        {
          title: "NexlytiQ Technologies — Online IT & Data Engineering",
          slug: "nexlytiq-technologies",
          description: "An advanced online training institute platform offering specialized programs in Python, Data Engineering, SQL, Power BI, AWS, Azure, and Generative AI.",
          category: "EdTech",
          image_url: "/assets/nexlytiq.jpg",
          live_url: "https://nexlytiqtechnologies.com",
          tags: ["EdTech", "Data Engineering", "Technical Partner", "Digital Marketing"],
          order: 3
        },
        {
          title: "Magvin Developers — Real Estate & Property Development",
          slug: "magvin-developers",
          description: "A premium real estate platform developed for Magvin Developers to showcase luxury residential and commercial properties.",
          category: "Real Estate",
          image_url: "/assets/magvin.png",
          live_url: "https://magvindevelopers.com/",
          tags: ["Real Estate", "Web Platform", "Lead Generation"],
          order: 4
        },
        {
          title: "Ask Associates — Civil Engineering & Construction Consulting",
          slug: "ask-associates",
          description: "A professional corporate website developed for Ask Associates showcasing civil engineering expertise and construction consulting.",
          category: "Corporate",
          image_url: "/assets/ask.png",
          live_url: "https://askassociates45.com",
          tags: ["Civil Engineering", "Construction", "Corporate Website"],
          order: 5
        },
        {
          title: "Folk Gokula Kshetram — Temple ERP & Devotee App",
          slug: "folk-gokula-kshetram",
          description: "A comprehensive digital platform and Android application developed for Folk Gokula Kshetram to streamline temple administration.",
          category: "Mobile App",
          image_url: "/assets/logo.png",
          live_url: "https://play.google.com/store/apps/details?id=com.vmkedgemind.folk_gokula_kshetram",
          tags: ["Mobile App", "Temple ERP", "Play Store"],
          order: 6
        }
      ];

      for (const p of seedProjects) {
        await client.query(`
          INSERT INTO cms_projects (title, slug, description, category, image_url, live_url, tags, is_featured, display_order)
          VALUES ($1, $2, $3, $4, $5, $6, $7, true, $8)
          ON CONFLICT (slug) DO NOTHING
        `, [p.title, p.slug, p.description, p.category, p.image_url, p.live_url, p.tags, p.order]);
      }
    }

    // 8. Seed Initial Partners if empty
    const { rows: partCount } = await client.query("SELECT COUNT(*) FROM cms_partners");
    if (parseInt(partCount[0].count) === 0) {
      console.log("Seeding initial CMS partners...");
      const seedPartners = [
        {
          name: "Quick Property Services",
          category: "technical_partner",
          logo_url: "/assets/qps.png",
          website_url: "https://quickpropertyservices.in/",
          industry: "Real Estate & Property Management",
          description: "A comprehensive property services platform developed for Quick Property Services.",
          order: 1
        },
        {
          name: "NexlytiQ Technologies",
          category: "technical_partner",
          logo_url: "/assets/nexlytiq.jpg",
          website_url: "https://nexlytiqtechnologies.com",
          industry: "EdTech & IT Training",
          description: "Online IT and Data Engineering training institute.",
          order: 2
        },
        {
          name: "Artgram",
          category: "client",
          logo_url: "/assets/ARTGRAM_LOGO_zdhftc.png.jpg",
          website_url: "https://artgram.in",
          industry: "Creative Studio & Events",
          description: "Creative studio hosting workshops and events.",
          order: 3
        },
        {
          name: "Ruhi Flavours",
          category: "client",
          logo_url: "/assets/RuhiLogo.png",
          website_url: "https://ruhiflavours.com",
          industry: "Food & Beverage",
          description: "Artisan food brand offering authentic pickles and homemade products.",
          order: 4
        },
        {
          name: "VMC Animal Welfare",
          category: "client",
          logo_url: "/assets/Vmc-logo-big.png",
          website_url: "",
          industry: "Animal Welfare & Monitoring",
          description: "Dog monitoring and management tracking system.",
          order: 5
        }
      ];

      for (const pt of seedPartners) {
        await client.query(`
          INSERT INTO cms_partners (name, category, logo_url, website_url, industry, description, is_active, display_order)
          VALUES ($1, $2, $3, $4, $5, $6, true, $7)
        `, [pt.name, pt.category, pt.logo_url, pt.website_url, pt.industry, pt.description, pt.order]);
      }
    }

    // 9. Seed Initial Jobs if empty
    const { rows: jobCount } = await client.query("SELECT COUNT(*) FROM job_postings");
    if (parseInt(jobCount[0].count) === 0) {
      console.log("Seeding initial job postings for HR...");
      const seedJobs = [
        {
          title: "Full-Stack Software Engineer (Next.js & Node.js)",
          slug: "full-stack-software-engineer",
          department: "Engineering",
          location: "Remote / Hybrid (Vijayawada)",
          type: "Full-Time",
          experience: "1-3 Years",
          salary: "₹4.5 - ₹8.0 LPA",
          description: "We are seeking a talented Full-Stack Engineer proficient in TypeScript, React, Next.js, and PostgreSQL to build scalable web products and high-impact client systems.",
          requirements: "• 1+ years experience with Next.js, TypeScript, and modern React.\n• Strong database proficiency with PostgreSQL & ORMs.\n• REST APIs and authentication mechanisms.\n• Good problem solving and communication skills.",
          responsibilities: "• Architect and build frontend and backend features for web apps.\n• Optimize site performance, accessibility, and SEO.\n• Work directly with product and design teams."
        },
        {
          title: "AI / Data Science Intern",
          slug: "ai-data-science-intern",
          department: "Data & AI",
          location: "Remote",
          type: "Internship",
          experience: "Fresher / Final Year Student",
          salary: "Paid Internship (Stipend)",
          description: "Join our cutting-edge AI & Data Engineering lab working on machine learning models, GenAI integrations, and analytics pipelines.",
          requirements: "• Proficiency in Python, Pandas, NumPy, and SQL.\n• Familiarity with Machine Learning concepts and LLM APIs.\n• Passion for learning and building real projects.",
          responsibilities: "• Assist in data cleaning, exploratory analysis, and ML model training.\n• Build prototype AI agents and data visualization dashboards."
        },
        {
          title: "Technical Talent Acquisition & HR Specialist",
          slug: "technical-hr-specialist",
          department: "Human Resources",
          location: "Vijayawada / Hybrid",
          type: "Full-Time",
          experience: "1-2 Years",
          salary: "₹3.5 - ₹6.0 LPA",
          description: "Help us discover, recruit, and onboard exceptional software engineers, interns, and creative talent while driving company culture and HR operations.",
          requirements: "• Experience with tech hiring, sourcing, and campus recruitment.\n• Excellent communication, negotiation, and interpersonal abilities.\n• Proficiency in recruitment tracking and onboarding workflows.",
          responsibilities: "• Manage the end-to-end hiring funnel for engineering and internship programs.\n• Coordinate interviews, evaluate candidate profiles, and organize onboarding."
        }
      ];

      for (const j of seedJobs) {
        await client.query(`
          INSERT INTO job_postings (title, slug, department, location, type, experience, salary, description, requirements, responsibilities, is_active)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)
          ON CONFLICT (slug) DO NOTHING
        `, [j.title, j.slug, j.department, j.location, j.type, j.experience, j.salary, j.description, j.requirements, j.responsibilities]);
      }
    }

    await client.query("COMMIT");
    console.log("Migration completed successfully!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
