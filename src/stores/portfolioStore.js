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
          "HTML",
          "CSS",
          "JavaScript",
          "Tailwind CSS",
          "React",
          "Inertia.js",
        ],
      },
      {
        category: "Backend",
        icon: "⚙️",
        items: ["Laravel", "PHP", "MySQL", "PostgreSQL", "SQLite"],
      },
      {
        category: "Tools & Services",
        icon: "🛠️",
        items: ["Git", "Vite", "Midtrans", "Cloudinary", "Railway"],
      },
    ],
    profile: {
      name: 'Havin Neo Dimas Nugraha',
      role: 'Fullstack Developer',
      location: 'Surabaya, Indonesia',
      email: 'havin.personal@gmail.com',
      whatsapp: 'wa.me/6281252205174',
      github: 'https://github.com/Havinoia',
      linkedin: 'https://linkedin.com/in/username',
      available: true,
      photo: '/images/havin.jpeg',
    },
    contact: {
      email: 'havin.personal@gmail.com',
      email_img: '/images/email_icon.png',
      whatsapp: 'wa.me/6281252205174',
      whatsapp_img: '/images/whatsapp_icon.png',
      instagram: 'https://www.instagram.com/havinneo',
      instagram_img: '/images/instagram_icon.png',
      github: 'https://github.com/Havinoia',
      github_img: '/images/github_icon.png'
    }
  }),
});
