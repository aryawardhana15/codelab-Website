// Landing Page Data - Codelab Indonesia

export const programs = [
    {
        id: 'codelab-learning',
        icon: 'book',
        emoji: '🚀',
        title: 'Bimbingan IT',
        subtitle: 'Codelab Learning',
        description:
            'Belajar coding tidak harus pusing sendirian. Dapatkan bimbingan intensif dari mentor berpengalaman dengan kurikulum yang menyesuaikan kecepatan belajarmu.',
        focus: 'Edukasi, Mentoring, dan Skill Up',
        features: [
            {
                icon: '🎮',
                text: 'Gamified Learning',
                desc: 'Selesaikan misi, raih XP, dan naik level biar belajar makin seru!',
            },
            {
                icon: '✅',
                text: 'All Tech Stacks',
                desc: 'Web, Mobile, Data, hingga persiapan skripsi/tugas.',
            },
            {
                icon: '✅',
                text: 'Student Friendly',
                desc: 'Harga ramah kantong mahasiswa/pelajar.',
            },
            {
                icon: '✅',
                text: 'Real Monitoring',
                desc: 'Progres belajarmu terpantau rapi.',
            },
        ],
        classes: [
            {
                name: 'Kelas 1 on 1',
                desc: 'Fokus penuh, materi custom sesuai kebutuhanmu.',
            },
            {
                name: 'Small Group',
                desc: 'Belajar seru bareng teman dengan biaya lebih hemat.',
            },
            {
                name: 'Kelas Intensif',
                desc: 'Crash course untuk persiapan Ujian, Tugas Besar, atau Interview.',
            },
            {
                name: 'Starter Pack',
                desc: 'Dari nol banget sampai bisa bikin program sederhana.',
            },
        ],
        cta: 'Konsultasi Belajar Gratis',
        ctaLink:
            'https://wa.me/6281348774066?text=Halo%20MinCode,%20saya%20ingin%20konsultasi%20belajar%20coding',
    },
    {
        id: 'coding-solutions',
        icon: 'code',
        emoji: '🛠️',
        title: 'Web & Coding Solutions',
        subtitle: 'Freelance Services',
        description:
            'Punya ide startup tapi gak bisa coding? Atau website kamu error dan butuh perbaikan cepat? Serahkan teknisnya pada kami.',
        focus: 'Jasa, Freelance, dan Problem Solving',
        features: [
            {
                icon: '💻',
                text: 'Web Development',
                desc: 'Pembuatan website company profile, toko online, hingga sistem informasi.',
            },
            {
                icon: '🐛',
                text: 'Debugging & Error Fix',
                desc: 'Perbaikan bug pada kode program kamu.',
            },
            {
                icon: '⚙️',
                text: 'Custom Project',
                desc: 'Request fitur dan teknologi sesuai permintaan (Modern Tech Stack).',
            },
        ],
        benefits: [
            'Harga Terjangkau & Transparan',
            'Revisi sampai tuntas (sesuai kesepakatan)',
            'Pengerjaan cepat dengan dokumentasi jelas',
        ],
        workflow: [
            {
                step: '📩',
                title: 'Submit',
                desc: 'Kirim detail tugas atau kebutuhanmu ke MinCode.',
            },
            {
                step: '🗣️',
                title: 'Konsultasi',
                desc: 'Diskusi singkat untuk memahami scope project.',
            },
            {
                step: '🤝',
                title: 'Deal',
                desc: 'Kesepakatan harga dan waktu pengerjaan.',
            },
            {
                step: '👨‍💻',
                title: 'Proses',
                desc: 'Codemates mengerjakan projectmu.',
            },
            {
                step: '📝',
                title: 'Review',
                desc: 'Ajukan revisi jika ada yang kurang sesuai.',
            },
            {
                step: '✅',
                title: 'Final',
                desc: 'Dokumen/Source code final dikirimkan.',
            },
        ],
        cta: 'Hubungi MinCode Sekarang',
        ctaLink:
            'https://wa.me/6281348774066?text=Halo%20MinCode,%20saya%20butuh%20jasa%20coding',
    },
    {
        id: 'codelab-event',
        icon: 'event',
        emoji: '💡',
        title: 'Codelab Knowledge Hub',
        subtitle: 'Event & Community',
        description:
            'Jangan ketinggalan update teknologi terbaru. Bergabunglah dengan komunitas kami, ikuti event seru, dan akses materi IT berkualitas secara gratis!',
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
    {
        category: 'Front-End',
        skills: ['HTML', 'CSS', 'JavaScript', 'React.js'],
    },
    { category: 'Back-End', skills: ['Java', 'Python', 'PHP', 'Node.js'] },
    { category: 'Database', skills: ['MySQL', 'MongoDB', 'PostgreSQL'] },
    { category: 'Cloud', skills: ['AWS', 'Google Cloud', 'Azure'] },
    { category: 'Extras', skills: ['GitHub', 'Docker', 'Kubernetes'] },
];

export const testimonials = [
    {
        id: 1,
        name: 'Umar Keandre',
        role: 'Kelas Web Development',
        company: 'Siswa SMP Hasbunallah Tabalong',
        image: '👨‍💻',
        rating: 5,
        text: 'Awalnya saya tidak tahu apa-apa tentang coding, tapi setelah mengikuti kelas di Codelab, saya sudah bisa membuat website sendiri. Mentornya sangat sabar dan membantu.',
    },
    {
        id: 2,
        name: 'Dery Prasetyo',
        role: 'Kelas Pemrograman Python',
        company: 'Manager PT PLN Persero',
        image: '👨‍💻',
        rating: 5,
        text: 'Sebelum mengenal Codelab, Saya tidak tahu apa itu Python dan saya butuh belajar Python karena diperlukan untuk pekerjaan saya, setelah mengikuti kelas di Codelab, saya sudah bisa membuat dashboard sendiri!!',
    },
    {
        id: 3,
        name: 'Fatimah Nurin',
        role: 'Kelas Web Development',
        company: 'Siswi SMAN 1 Balikpapan',
        image: '👨‍🎓',
        rating: 4,
        text: 'Bimbingan IT di Codelab sangat personal dan fokus dengan kebutuhan saya. Dalam beberapa hari, saya berhasil membuat website pertama saya, makasih mimin Codelab!!',
    },
    {
        id: 4,
        name: 'Prima Handani',
        role: 'Kelas Web Development',
        company: 'Mahasiswa Telkom University',
        image: '👩‍🎓',
        rating: 5,
        text: 'Awalnya bingung banget sama tugas kuliah Web Programming, tapi mentor di Codelab sabar banget jelasinnya dari nol. Sekarang gak cuma paham materi kuliah, tapi udah bisa bikin project portfolio sendiri!',
    },
];

export const stats = [
    { number: '20+', label: 'Siswa Sukses' },
    { number: '10+', label: 'Expert Mentor' },
    { number: '10+', label: 'Kursus Tersedia' },
    { number: '85%', label: 'Tingkat Kepuasan' },
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
    company: [
        { label: 'Tentang Kami', href: '#programs' },
        // { label: 'Mentor', href: '/mentors' },
        { label: 'Karir', href: '#contact' },
        { label: 'Kontak', href: '#contact' },
    ],
};
