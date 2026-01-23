// Register Feature Data

export const registerBranding = {
  title: 'Start Your Game!',
  subtitle: 'Bergabung di Platform Edukasi IT Berbasis Gamifikasi #1 di Indonesia.',
  features: [
    'Belajar coding berasa main game',
    'Selesaikan quest & raih rewards',
    'Mentor expert siap membantumu',
  ],
};

export const registerFormConfig = {
  title: 'Buat Akun Baru',
  loginLink: {
    text: 'Sudah punya akun?',
    linkText: 'Login di sini',
    href: '/login',
  },
  submitButtonText: 'Daftar Sekarang',
  loadingText: 'Memproses...',
  socialLoginText: 'atau',
  googleButtonText: 'Daftar dengan Google',
  termsText: {
    prefix: 'Dengan mendaftar, Anda menyetujui',
    terms: 'Syarat & Ketentuan',
    and: 'dan',
    privacy: 'Kebijakan Privasi',
  },
};

export const roleOptions = [
  { value: 'pelajar', label: '🎓 Pelajar - Ingin belajar coding' },
  { value: 'mentor', label: '🏆 Mentor - Ingin mengajar' },
];

export const mentorFieldsConfig = {
  title: 'Informasi Mentor',
  optional: '(opsional)',
  fields: {
    cv_url: {
      label: 'Link CV/Portfolio',
      placeholder: 'https://drive.google.com/...',
      helper: 'Google Drive, Dropbox, atau platform lainnya',
    },
    expertise: {
      label: 'Keahlian',
      placeholder: 'JavaScript, React, Node.js',
      helper: 'Pisahkan dengan koma',
    },
    experience: {
      label: 'Pengalaman',
      placeholder: '5 tahun pengalaman sebagai Full Stack Developer...',
    },
  },
};

export const registerValidation = {
  name: {
    required: 'Nama wajib diisi',
  },
  email: {
    required: 'Email wajib diisi',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Email tidak valid',
    },
  },
  password: {
    required: 'Password wajib diisi',
    minLength: {
      value: 8,
      message: 'Password minimal 8 karakter',
    },
  },
  confirmPassword: {
    required: 'Konfirmasi password wajib diisi',
  },
};
