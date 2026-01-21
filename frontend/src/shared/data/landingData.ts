// Landing Page Data - Codelab Indonesia

export const programs = [
  {
    id: 'codelab-learning',
    icon: 'book',
    emoji: '🚀',
    title: 'Bimbingan IT',
    subtitle: 'Codelab Learning',
    description: 'Belajar coding tidak harus pusing sendirian. Dapatkan bimbingan intensif dari mentor berpengalaman dengan kurikulum yang menyesuaikan kecepatan belajarmu.',
    focus: 'Edukasi, Mentoring, dan Skill Up',
    features: [
      { icon: '✅', text: 'All Tech Stacks', desc: 'Web, Mobile, Data, hingga persiapan skripsi/tugas.' },
      { icon: '✅', text: 'Student Friendly', desc: 'Harga ramah kantong mahasiswa/pelajar.' },
      { icon: '✅', text: 'Real Monitoring', desc: 'Progres belajarmu terpantau rapi.' },
      { icon: '✅', text: 'Unlimited Support', desc: 'Bebas tanya jawab di luar jam belajar sampai paham!' },
    ],
    classes: [
      { name: 'Kelas 1 on 1', desc: 'Fokus penuh, materi custom sesuai kebutuhanmu.' },
      { name: 'Small Group', desc: 'Belajar seru bareng teman dengan biaya lebih hemat.' },
      { name: 'Kelas Intensif', desc: 'Crash course untuk persiapan Ujian, Tugas Besar, atau Interview.' },
      { name: 'Starter Pack', desc: 'Dari nol banget sampai bisa bikin program sederhana.' },
    ],
    cta: 'Konsultasi Belajar Gratis',
    ctaLink: 'https://wa.me/6281348774066?text=Halo%20MinCode,%20saya%20ingin%20konsultasi%20belajar%20coding',
  },
  {
    id: 'coding-solutions',
    icon: 'code',
    emoji: '🛠️',
    title: 'Web & Coding Solutions',
    subtitle: 'Freelance Services',
    description: 'Punya ide startup tapi gak bisa coding? Atau website kamu error dan butuh perbaikan cepat? Serahkan teknisnya pada kami.',
    focus: 'Jasa, Freelance, dan Problem Solving',
    features: [
      { icon: '💻', text: 'Web Development', desc: 'Pembuatan website company profile, toko online, hingga sistem informasi.' },
      { icon: '🐛', text: 'Debugging & Error Fix', desc: 'Perbaikan bug pada kode program kamu.' },
      { icon: '⚙️', text: 'Custom Project', desc: 'Request fitur dan teknologi sesuai permintaan (Modern Tech Stack).' },
    ],
    benefits: [
      'Harga Terjangkau & Transparan',
      'Revisi sampai tuntas (sesuai kesepakatan)',
      'Pengerjaan cepat dengan dokumentasi jelas',
    ],
    workflow: [
      { step: '📩', title: 'Submit', desc: 'Kirim detail tugas atau kebutuhanmu ke MinCode.' },
      { step: '🗣️', title: 'Konsultasi', desc: 'Diskusi singkat untuk memahami scope project.' },
      { step: '🤝', title: 'Deal', desc: 'Kesepakatan harga dan waktu pengerjaan.' },
      { step: '👨‍💻', title: 'Proses', desc: 'Codemates mengerjakan projectmu.' },
      { step: '📝', title: 'Review', desc: 'Ajukan revisi jika ada yang kurang sesuai.' },
      { step: '✅', title: 'Final', desc: 'Dokumen/Source code final dikirimkan.' },
    ],
    cta: 'Hubungi MinCode Sekarang',
    ctaLink: 'https://wa.me/6281348774066?text=Halo%20MinCode,%20saya%20butuh%20jasa%20coding',
  },
  {
    id: 'codelab-event',
    icon: 'event',
    emoji: '💡',
    title: 'Codelab Knowledge Hub',
    subtitle: 'Event & Community',
    description: 'Jangan ketinggalan update teknologi terbaru. Bergabunglah dengan komunitas kami, ikuti event seru, dan akses materi IT berkualitas secara gratis!',
    focus: 'Knowledge Sharing, Branding, dan Lead Magnet',
    events: [
      {
        name: 'IT Insights & Sharing',
        desc: 'Pantau terus sosial media dan blog kami untuk daily snippet, tips coding, dan roadmap karir di dunia IT. Ilmu mahal yang kami bagikan gratis!',
        icon: '📱',
      },
      {
        name: 'Zoom Bareng Master',
        desc: 'Sesi live discussion eksklusif mengundang praktisi/ahli di bidangnya. Topik: Bedah teknologi terbaru, tips lolos kerja di Tech Company, hingga bedah kodingan.',
        icon: '🎥',
        format: 'Santai, interaktif, dan penuh daging.',
      },
      {
        name: 'Trial Class',
        desc: 'Masih ragu mau ambil kelas codelab? Ikuti sesi Trial Class kami. Rasakan metode mengajar mentor Codelab dengan materi dasar yang mudah dipahami.',
        icon: '🎓',
        highlight: 'GRATIS untuk pendaftar tercepat setiap bulannya.',
      },
    ],
    cta: 'Lihat Jadwal Event Terdekat',
    ctaLink: '/events',
  },
];

export const roadmap = [
  { category: 'Front-End', skills: ['HTML', 'CSS', 'JavaScript', 'React.js'] },
  { category: 'Back-End', skills: ['Java', 'Python', 'PHP', 'Node.js'] },
  { category: 'Database', skills: ['MySQL', 'MongoDB', 'PostgreSQL'] },
  { category: 'Cloud', skills: ['AWS', 'Google Cloud', 'Azure'] },
  { category: 'Extras', skills: ['GitHub', 'Docker', 'Kubernetes'] },
];

export const testimonials = [
  {
    id: 1,
    name: 'Andi Pratama',
    role: 'Full-Stack Developer',
    company: 'Tech Startup',
    image: '👨‍💻',
    rating: 5,
    text: 'Codelab membantu saya dari tidak bisa coding sama sekali menjadi Full-Stack Developer dalam 6 bulan. Mentornya sangat supportive dan materi pembelajarannya sangat terstruktur.',
  },
  {
    id: 2,
    name: 'Sarah Wijaya',
    role: 'Data Scientist',
    company: 'E-commerce Company',
    image: '👩‍💻',
    rating: 5,
    text: 'Workshop Machine Learning di Codelab benar-benar membuka mata saya. Sekarang saya sudah bekerja sebagai Data Scientist berkat skill yang saya pelajari di sini.',
  },
  {
    id: 3,
    name: 'Budi Santoso',
    role: 'Mobile Developer',
    company: 'Fintech Startup',
    image: '👨‍🎓',
    rating: 5,
    text: 'Bimbingan IT di Codelab sangat personal dan fokus pada kebutuhan saya. Dalam 3 bulan, saya berhasil landing my first job sebagai Mobile Developer!',
  },
  {
    id: 4,
    name: 'Dina Rahmawati',
    role: 'Frontend Developer',
    company: 'Digital Agency',
    image: '👩‍🎓',
    rating: 5,
    text: 'Dari mahasiswa yang bingung mau ngapain, sekarang udah kerja di agency keren. Makasih Codelab untuk bimbingannya yang super sabar!',
  },
];

export const stats = [
  { number: '500+', label: 'Alumni Sukses' },
  { number: '50+', label: 'Expert Mentor' },
  { number: '100+', label: 'Kursus Tersedia' },
  { number: '95%', label: 'Tingkat Kepuasan' },
];

export const contactInfo = {
  whatsapp: '+62 813-4877-4066',
  whatsappLink: 'https://wa.me/6281348774066',
  email: 'hello@codelab.id',
  instagram: '@codelab_idn',
  instagramLink: 'https://instagram.com/codelab_idn',
  linkedin: 'Codelab Indonesia',
  linkedinLink: 'https://linkedin.com/company/codelab-indonesia',
};

export const footerLinks = {
  program: [
    { label: 'Bimbingan IT', href: '#programs' },
    { label: 'Coding Solutions', href: '#programs' },
    { label: 'Workshop & Event', href: '#programs' },
    { label: 'Trial Class', href: '#programs' },
  ],
  courses: [
    { label: 'Web Development', href: '/courses' },
    { label: 'Mobile Development', href: '/courses' },
    { label: 'Data Science', href: '/courses' },
    { label: 'Machine Learning', href: '/courses' },
  ],
  company: [
    { label: 'Tentang Kami', href: '/about' },
    { label: 'Mentor', href: '/mentors' },
    { label: 'Karir', href: '/careers' },
    { label: 'Kontak', href: '#contact' },
  ],
};
