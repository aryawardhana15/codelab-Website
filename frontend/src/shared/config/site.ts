/**
 * Central SEO / site configuration.
 * Override the base URL per environment with NEXT_PUBLIC_SITE_URL.
 */
export const siteConfig = {
  name: 'Codelab',
  shortName: 'Codelab',
  // Production domain — keep in sync with the deployed host.
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://codelabstudio.cloud',
  title: 'Codelab — Belajar IT, Bangun Solusi, Wujudkan Mimpi',
  description:
    'Platform ekosistem IT terlengkap di Indonesia. Belajar coding dengan gamifikasi, jasa pembuatan sistem profesional, hingga event & komunitas teknologi yang aktif berbagi ilmu.',
  // Brand orange — used for the browser theme color and PWA manifest.
  themeColor: '#F97316',
  locale: 'id_ID',
  keywords: [
    'belajar coding',
    'kursus IT online',
    'belajar programming',
    'jasa pembuatan website',
    'jasa coding',
    'bootcamp IT Indonesia',
    'kursus pemrograman',
    'komunitas IT',
    'gamifikasi belajar',
    'Codelab',
    'Codelab Indonesia',
  ],
  ogImage: '/codelab-icon-transparent.png',
  social: {
    instagram: 'https://instagram.com/codelab_idn',
    linkedin: 'https://linkedin.com/company/codelab-indonesia',
  },
  email: 'codelab.idn@gmail.com',
} as const;
