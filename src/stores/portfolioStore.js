import { defineStore } from "pinia";

export const usePortfolioStore = defineStore("portfolio", {
  state: () => ({
    projects: [
      {
        id: 1,
        title: "PrimeProperty",
        description:
          "A web-based property management application built with native PHP and MySQL. Features include admin authentication, full CRUD property management, search & filtering, pagination, and property status handling (Available/Sold).",
        fullDescription:
          "PrimeProperty is a comprehensive property management solution designed to streamline real estate operations. Developed with native PHP and MySQL, this platform offers a robust administrative panel for seamless property tracking. Key functionalities include complete CRUD operations for property listings, advanced search filters, and an intuitive UI to toggle property availability. The application prioritizes performance and ease of use, ensuring that agents and administrators can manage property data effectively without any steep learning curves.",
        tags: ["PHP Native", "MySQL", "HTML", "CSS"],
        demo: "https://primeproperty.infinityfreeapp.com/",
        github: "https://github.com/Havinoia/primeproperty-web.git",
        featured: true,
        image: "/images/mockup-porto1.png",
        gallery: ["/images/doc1-1.png", "/images/doc1-2.png", "/images/doc1-3.png"],
        emoji: "🏠",
        month: "January",
        year: "2026",
        themes: ["Website", "Real Estate", "Management"],
      },
      {
        id: 2,
        title: "VinShop",
        description:
          "A full-featured e-commerce web application built with Laravel 12. It includes authentication, product management, shopping cart, checkout system, and Midtrans payment integration (QRIS, GoPay, Bank Transfer). Features admin dashboard, order management, and Cloudinary-based image storage.",
        fullDescription:
          "VinShop is a modern, full-featured e-commerce application crafted using Laravel 12. It provides an end-to-end shopping experience starting from user authentication to a customized cart and checkout process. To facilitate secure transactions, VinShop integrates directly with the Midtrans Payment Gateway, allowing various payment options like QRIS, GoPay, and Bank Transfers. Accompanied by an insightful admin dashboard and reliable Cloudinary-based image hosting, the platform demonstrates a scalable approach to building reliable online retail systems.",
        tags: ["Laravel 12", "MySQL", "Tailwind CSS", "Midtrans", "Cloudinary"],
        demo: "https://vinshop-production.up.railway.app/",
        github: "https://github.com/Havinoia/vinshop-web.git",
        featured: true,
        image: "/images/mockup-porto2.png",
        gallery: ["/images/doc2-1.png", "/images/doc2-2.png", "/images/doc2-3.png"],
        emoji: "🛍️",
        month: "February",
        year: "2026",
        themes: ["E-Commerce", "Retail", "Web App"],
      },
      {
        id: 3,
        title: "HealthTic Monitor",
        description:
          "A real-time global health statistics desktop application built with NativePHP. Features include live data visualization, mini widget mode, system tray integration, always-on-top window, and lightweight SQLite database for standalone usage.",
        fullDescription:
          "HealthTic Monitor is a desktop utility application developed using NativePHP to keep track of critical global health statistical data in real-time. By utilizing a lightweight SQLite database, it functions effectively offline while syncing online when connected. Users can view insightful charts, dock the app to the system tray, or switch to a minimal 'always-on-top' widget mode to monitor essential metrics effortlessly while working on other tasks.",
        tags: [
          "NativePHP",
          "Laravel",
          "SQLite",
          "Chart Visualization",
          "Desktop App",
        ],
        demo: "https://github.com/Havinoia/healthtic-app.git", // kosongkan atau isi jika nanti ada video/demo
        github: "https://github.com/Havinoia/healthtic-app.git",
        featured: true,
        image: "/images/mockup-porto3.png",
        gallery: ["/images/doc3-1.png", "/images/doc3-2.png"],
        emoji: "🩺",
        month: "March",
        year: "2026",
        themes: ["Desktop App", "Health", "Analytics"],
      },
      {
        id: 4,
        title: "Nusantara Logistics",
        description:
          "A Transportation Management System (TMS) built with Laravel, React, and Inertia.js. Features include real-time fleet tracking with interactive maps, courier and trip management, automatic PDF document generation, and spatial data handling using PostgreSQL with PostGIS.",
        fullDescription:
          "Nusantara Logistics is a comprehensive Transportation Management System (TMS) engineered for modern logistics operations. Building on the synergy of Laravel, React, and Inertia.js, the system delivers an interface that feels as fast as an SPA with the robust backend capabilities of Laravel. The app integrates PostgreSQL with PostGIS alongside Leaflet.js to pinpoint real-time fleet positions. Key features also entail comprehensive trip management interfaces and automated PDF manifest creations.",
        tags: [
          "Laravel 12",
          "React",
          "Inertia.js",
          "PostgreSQL",
          "PostGIS",
          "Leaflet.js",
        ],
        demo: "https://github.com/Havinoia/logistik-web.git", // isi nanti kalau ada
        github: "https://github.com/Havinoia/logistik-web.git",
        featured: true,
        image: "/images/mockup-porto4.png",
        gallery: ["/images/doc4-1.png", "/images/doc4-2.png", "/images/doc4-3.png"],
        emoji: "🚛",
        month: "April",
        year: "2026",
        themes: ["Logistics", "Enterprise", "Web App"],
      },
      {
        id: 5,
        title: "TypeRush",
        description:
          "A modern speed-typing platform designed for a seamless, accurate, and challenging typing experience. Features real-time WPM and accuracy tracking.",
        fullDescription:
          "TypeRush is a high-performance typing practice platform built with Laravel, Vue 3, and Inertia.js. It features a real-time typing engine that calculates Words Per Minute (WPM) and accuracy as you type. The application boasts a premium, minimalist UI/UX crafted with Tailwind CSS, a comprehensive authentication system to track user progress, and a responsive design that ensures a smooth experience across all devices.",
        tags: [
          "Laravel 11",
          "Vue 3",
          "Inertia.js",
          "Tailwind CSS",
          "Vite",
          "SQLite",
        ],
        demo: "https://github.com/Havinoia/typerush.git",
        github: "https://github.com/Havinoia/typerush.git",
        featured: true,
        image: "/images/mockup-porto5.png",
        gallery: ["/images/doc5-1.png", "/images/doc5-2.png", "/images/doc5-3.png", "/images/doc5-4.png"],
        emoji: "🏎️",
        month: "April",
        year: "2026",
        themes: ["Typing Tool", "Education", "Web App"],
      },
    ],
    skills: [
      {
        category: "Programming Languages",
        icon: "💻",
        items: [
          { name: "PHP", img: "/images/php.png", desc: "A popular general-purpose scripting language that is especially suited to web development.", setupCode: "php -v", docUrl: "https://www.php.net/" },
          { name: "JavaScript", img: "/images/js.png", desc: "High-level, often just-in-time compiled language that conforms to the ECMAScript specification.", setupCode: "node -v", docUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
          { name: "TypeScript", img: "/images/ts.png", desc: "Strongly typed programming language that builds on JavaScript.", setupCode: "tsc -v", docUrl: "https://www.typescriptlang.org/" },
          { name: "Python", img: "/images/python.png", desc: "Interpreted high-level general-purpose programming language.", setupCode: "python --version", docUrl: "https://www.python.org/" },
        ],
      },
      {
        category: "Frontend",
        icon: "🎨",
        items: [
          { name: "React", img: "/images/react.png", desc: "A JavaScript library for building user interfaces.", setupCode: "npx create-react-app my-app", docUrl: "https://reactjs.org/" },
          { name: "Vue", img: "/images/vue.png", desc: "The Progressive JavaScript Framework.", setupCode: "npm create vue@latest", docUrl: "https://vuejs.org/" },
        ],
      },
      {
        category: "Backend",
        icon: "⚙️",
        items: [
          { name: "Laravel", img: "/images/laravel.png", desc: "The PHP Framework for Web Artisans.", setupCode: "composer create-project laravel/laravel app", docUrl: "https://laravel.com/" },
          { name: "Next.js", img: "/images/nextjs.png", desc: "The React Framework for the Web.", setupCode: "npx create-next-app@latest", docUrl: "https://nextjs.org/" },
        ],
      },
      {
        category: "Database & Query",
        icon: "📊",
        items: [
          { name: "MySQL", img: "/images/mysql.png", desc: "The world's most popular open source database.", setupCode: "mysql --version", docUrl: "https://www.mysql.com/" },
          { name: "PostgreSQL", img: "/images/postgresql.png", desc: "The world's most advanced open source relational database.", setupCode: "postgres --version", docUrl: "https://www.postgresql.org/" },
          { name: "SQLite", img: "/images/sqlite.png", desc: "C-language library that implements a small, fast, self-contained SQL database engine.", setupCode: "sqlite3 --version", docUrl: "https://www.sqlite.org/" },
        ],
      },
      {
        category: "DevOps",
        icon: "🗄️",
        items: [
          { name: "Docker", img: "/images/docker.png", desc: "Empowering App Development for Developers.", setupCode: "docker --version", docUrl: "https://www.docker.com/" },
          { name: "Git", img: "/images/git.png", desc: "Distributed version control system.", setupCode: "git --version", docUrl: "https://git-scm.com/" },
          { name: "Linux", img: "/images/linux.png", desc: "Open-source Unix-like operating systems.", setupCode: "uname -a", docUrl: "https://www.linux.org/" },
          { name: "Nginx", img: "/images/nginx.png", desc: "High performance web server.", setupCode: "nginx -v", docUrl: "https://nginx.org/" },
        ],
      },
    ],
    profile: {
      name: "Havin Neo Dimas Nugraha",
      role: "Fullstack Developer",
      location: "Nganjuk, Indonesia",
      university: "Universitas Teknologi Yogyakarta",
      bio: "Informatics graduate from Universitas Teknologi Yogyakarta (GPA 3.60) with a passion for building applications and solving problems. Experienced in system analysis and data processing, with a structured mindset, adaptability, and a strong drive to keep learning and growing.",
      email: "havin.personal@gmail.com",
      whatsapp: "6281252205174",
      github: "https://github.com/Havinoia",
      linkedin: "https://linkedin.com/in/username",
      available: true,
      photo: "/images/havin.jpeg",
    },
    contact: {
      email: "havin.personal@gmail.com",
      email_img: "/images/email_icon.png",
      whatsapp: "6281252205174",
      whatsapp_img: "/images/whatsapp_icon.png",
      instagram: "https://www.instagram.com/havinneo",
      instagram_img: "/images/instagram_icon.png",
      github: "https://github.com/Havinoia",
      github_img: "/images/github_icon.png",
    },
    cert: [
      {
        id: 1,
        title: "PEMANFAATAN GEMINI AI SEBAGAI INOVASI PEMBELAJARAN INTERAKTIF",
        issuer: "Diklat.co",
        image: "/images/sertif-1.png", // Path gambar
        link: "/documents/sertif-1.pdf", // Path download/lihat PDF
        date: "2024",
        description:
          "Utilization of Gemini AI to create more interactive and innovative learning methods.",
      },
      {
        id: 2,
        title:
          "Seminar Nasional Transformasi Pembelajaran Ekonomi di Era AI & Big Data",
        issuer: "e-Guru.id",
        image: "/images/sertif-2.png", // Path gambar
        link: "/documents/sertif-2.pdf", // Path download/lihat PDF
        date: "2025",
        description:
          "Utilization of AI and Big Data to enhance effectiveness and innovation in the economic learning process.",
      },
      {
        id: 3,
        title:
          "Seminar Nasional Pentingnya Manajemen Arsip dalam Organisasi : Manfaat dan Tantangan Berbasis Teknologi",
        issuer: "e-Guru.id",
        image: "/images/sertif-3.png", // Path gambar
        link: "/documents/sertif-3.pdf", // Path download/lihat PDF
        date: "2025",
        description:
          "Understanding the importance of technology-based records management to improve the efficiency of organizational information management.",
      },
    ],
  }),
});
