import { defineStore } from "pinia";

export const usePortfolioStore = defineStore("portfolio", {
  state: () => ({
    projects: [
      {
        id: 1,
        title: "PrimeProperty",
        description:
          "A web-based property management application built with native PHP and MySQL. Features an admin panel for complete CRUD operations, property status management (Available/Sold), and secure session-based authentication.",
        fullDescription:
          "PrimeProperty is a streamlined Property Management System designed to simplify real estate operations. Developed as a foundational backend project, it features a robust administrative dashboard where managers can perform full CRUD (Create, Read, Update, Delete) operations on property listings. Key functionalities include dynamic property status toggling (Available/Sold) with visual indicators, advanced search and filtering, and pagination. The application is built on a Native PHP architecture with MySQL, prioritizing performance and fundamental web security through session-based authentication.",
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
          "A modern e-commerce platform built with Laravel 12 and integrated with Midtrans for secure payments. Includes customer shopping workflows, an admin dashboard for product management, and persistent Cloudinary image storage.",
        fullDescription:
          "VinShop is a high-performance e-commerce solution engineered with Laravel 12 and Tailwind CSS. It provides an end-to-end shopping experience, featuring a secure customer journey from registration to checkout. A standout feature is the integration of the Midtrans Payment Gateway, supporting various methods like QRIS, GoPay, and Bank Transfers in a sandbox environment. The platform includes a powerful administrative dashboard for managing orders, categories, and products with persistent image hosting via Cloudinary. This ensures that media assets remain secure and accessible even during frequent deployments.",
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
          "A real-time global health statistics desktop application built with NativePHP. It features live data visualizations from a taskbar-integrated interface, including a mini-widget mode and \"Always on Top\" functionality.",
        fullDescription:
          "HealthTic Monitor is an innovative desktop utility that transforms complex global health data into intuitive, real-time visualizations. Built using NativePHP, it functions as a standalone application that sits in the system tray, allowing users to monitor critical metrics like diabetes and smoking rates without opening a browser. The app features a versatile UI with a \"Mini Mode\" for space-saving monitoring and an \"Always on Top\" toggle. By leveraging a lightweight SQLite database, HealthTic ensures fast performance and easy distribution as a portable Windows installer (.exe).",
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
          "A Transportation Management System (TMS) featuring a high-performance \"Control Tower\" for real-time fleet tracking. Built with Laravel, React, and Inertia.js, utilizing PostGIS for advanced spatial data handling.",
        fullDescription:
          "Nusantara Logistics is a comprehensive TMS designed for real-time operational efficiency in the logistics sector. Centered around a sophisticated \"Control Tower,\" it uses Leaflet.js and PostGIS to provide interactive, live mapping of courier positions, warehouses, and delivery destinations. The platform automates trip management, converting complex logistical data into professional PDF manifests (Surat Jalan) instantly. Built with the Laravel and Inertia.js bridge, it offers a seamless Single Page Application (SPA) experience while handling complex spatial queries and fleet statuses (Available/Busy/Offline) across multiple warehouses.",
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
        title: "JobHunt",
        description:
          "An AI-powered career assistant built as a Chrome extension and Laravel dashboard. It uses Google Gemini AI to analyze CVs, provide LinkedIn skill matching, and identify skill gaps for job seekers.",
        fullDescription:
          "JobHunt is a premium career intelligence platform that leverages the power of Google Gemini AI to revolutionize the job searching process. It consists of a sophisticated Chrome extension that integrates directly with LinkedIn to provide real-time Smart Match scores and detailed skill gap analyses. Users can upload their PDF resumes to a central Laravel dashboard, where the AI extracts core competencies and provides deep-domain audits of their professional profile. The system includes a multi-tiered plan (Freemium vs. Premium), secure payment integration via Pakasir, and extensive testing via PHPUnit to ensure high reliability in AI-driven career insights.",
        tags: ["Laravel 11", "Chrome Extension", "Tailwind CSS", "PostgreSQL", "Manifest v3"],
        demo: "https://github.com/Havinoia/jobhunt.git",
        github: "https://github.com/Havinoia/jobhunt.git",
        featured: true,
        image: "/images/mockup-porto5.png", // Menggunakan mockup sementara
        gallery: ["/images/doc5-1.png", "/images/doc5-2.png", "/images/doc5-3.png", "/images/doc5-4.png"],
        emoji: "💼",
        month: "April",
        year: "2024",
        themes: ["Extension", "Productivity", "Web App"],
      },
      {
        id: 6,
        title: "TypeRush",
        description:
          "A modern speed-typing platform featuring a real-time typing engine for WPM and accuracy tracking. Developed with Laravel and Vue 3 for a premium, high-performance practice experience.",
        fullDescription:
          "TypeRush is a dedicated practice platform designed for enthusiasts looking to master their typing speed and accuracy. It features a custom-built, real-time typing engine that provides instant feedback on Words Per Minute (WPM) and precision. The application boasts a minimalist yet premium UI/UX crafted with Tailwind CSS and Vue 3, powered by a robust Laravel backend via Inertia.js. With a comprehensive authentication system to track personal progress and persistent results storage, TypeRush offers a seamless, SPA-like experience that is fully responsive across all desktop and mobile devices.",
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
        image: "/images/mockup-porto6.png",
        gallery: ["/images/doc6-1.png", "/images/doc6-2.png", "/images/doc6-3.png", "/images/doc6-4.png"],
        emoji: "🏎️",
        month: "April",
        year: "2026",
        themes: ["Typing Tool", "Education", "Web App"],
      },
      {
        id: 7,
        title: "GAMIFY_SYSTEM v3.0",
        description:
          "A high-fidelity, gamified learning platform with a 90s Arcade & Cyberpunk aesthetic. Built with Laravel 13 and Tailwind CSS v4 to deliver an immersive, retro-futuristic user experience.",
        fullDescription:
          "GAMIFY_SYSTEM v3.0 is a cutting-edge engagement platform that blends education with the high-octane energy of a 90s arcade. Utilizing the latest Laravel 13 features and Tailwind CSS v4, it features a complete 'Dark Arcade' design system with CRT scanline effects, flickering animations, and neon-drenched interfaces. The system includes interactive quest-based quizzes, a real-time 'Hall of Fame' leaderboard, and a persistent achievement badge system. Every interaction, from the 'System Boot' authentication sequence to the dynamic dashboard, is engineered to transport users into a gamified, retro-tech atmosphere.",
        tags: ["Laravel 13", "Livewire", "Tailwind CSS v4", "Vite", "MySQL"],
        demo: "https://github.com/Havinoia/gamify.git",
        github: "https://github.com/Havinoia/gamify.git",
        featured: true,
        image: "/images/mockup-porto7.png",
        gallery: ["/images/doc7-1.png", "/images/doc7-2.png", "/images/doc7-3.png", "/images/doc7-4.png", "/images/doc7-5.png", "/images/doc7-6.png"],
        emoji: "🕹️",
        month: "April",
        year: "2026",
        themes: ["Gamification", "Education", "Web App"],
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
      name: "Havin Neo Dimas Nugraha" || "",
      role: "Fullstack Developer" || "",
      location: "Nganjuk, Indonesia" || "",
      university: "Universitas Teknologi Yogyakarta" || "",
      bio: "Bachelor's degree graduate in Informatics from Universitas Teknologi Yogyakarta with a GPA of 3.60. Possesses skills in system analysis, application development, and data processing. Accustomed to thinking systematically, solving problems in a structured manner, and maintaining high accuracy in managing information. Demonstrates strong adaptability, discipline, and the ability to work both independently and collaboratively within a team. Committed to continuous learning and developing both technical and non-technical competencies to contribute effectively in a professional work environment.",
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
