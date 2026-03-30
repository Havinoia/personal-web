import { defineStore } from "pinia";

export const usePortfolioStore = defineStore("portfolio", {
  state: () => ({
    projects: [
      {
        id: 1,
        title: "PrimeProperty",
        description:
          "A web-based property management application built with native PHP and MySQL. Features include admin authentication, full CRUD property management, search & filtering, pagination, and property status handling (Available/Sold).",
        tags: ["PHP Native", "MySQL", "HTML", "CSS"],
        demo: "https://primeproperty.infinityfreeapp.com/",
        github: "https://github.com/Havinoia/primeproperty-web.git",
        featured: true,
        image: "/images/porto-1.png",
        emoji: "🏠",
        year: "2026",
      },
      {
        id: 2,
        title: "VinShop",
        description:
          "A full-featured e-commerce web application built with Laravel 12. It includes authentication, product management, shopping cart, checkout system, and Midtrans payment integration (QRIS, GoPay, Bank Transfer). Features admin dashboard, order management, and Cloudinary-based image storage.",
        tags: ["Laravel 12", "MySQL", "Tailwind CSS", "Midtrans", "Cloudinary"],
        demo: "https://vinshop-production.up.railway.app/",
        github: "https://github.com/Havinoia/vinshop-web.git",
        featured: true,
        image: "/images/porto-2.png",
        emoji: "🛍️",
        year: "2026",
      },
      {
        id: 3,
        title: "HealthTic Monitor",
        description:
          "A real-time global health statistics desktop application built with NativePHP. Features include live data visualization, mini widget mode, system tray integration, always-on-top window, and lightweight SQLite database for standalone usage.",
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
        image: "/images/porto-3.png",
        emoji: "🩺",
        year: "2026",
      },
      {
        id: 4,
        title: "Nusantara Logistics",
        description:
          "A Transportation Management System (TMS) built with Laravel, React, and Inertia.js. Features include real-time fleet tracking with interactive maps, courier and trip management, automatic PDF document generation, and spatial data handling using PostgreSQL with PostGIS.",
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
        image: "/images/porto-4.png",
        emoji: "🚛",
        year: "2026",
      },
    ],
    skills: [
      {
        category: "Frontend",
        icon: "🖥️",
        items: [
          { name: "Vue 3", img: "/images/vue.png" },
          { name: "React", img: "/images/react.png" },
          { name: "TypeScript", img: "/images/ts.png" },
          { name: "Tailwind", img: "/images/tw.png" },
          { name: "Vite", img: "/images/vite.png" },
        ],
      },
      {
        category: "Backend",
        icon: "⚙️",
        items: [
          { name: "Laravel", img: "/images/laravel.png" },
          { name: "PHP", img: "/images/php.png" },
          { name: "MySQL", img: "/images/mysql.png" },
          
        ],
      },
      {
        category: "DevOps",
        icon: "🗄️",
        items: [
          { name: "Docker", img: "/images/docker.png" },
          { name: "Git", img: "/images/git.png" },
          { name: "Linux", img: "/images/linux.png" },
          { name: "Nginx", img: "/images/nginx.png" },
        ],
      },
    ],
    profile: {
      name: "Havin Neo Dimas Nugraha",
      role: "Fullstack Developer",
      location: "Surabaya, Indonesia",
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
      // ...
    ],
  }),
});
