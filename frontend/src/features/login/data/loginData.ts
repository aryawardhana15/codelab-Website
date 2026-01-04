// Login Feature Data

export const loginBranding = {
  title: 'Selamat Datang Kembali!',
  subtitle: 'Tingkatkan skill coding kamu dan wujudkan karir impian di dunia IT.',
  features: [
    'Akses 100+ kursus berkualitas',
    'Belajar dari mentor berpengalaman',
    'Dapatkan sertifikat resmi',
  ],
};

export const loginFormConfig = {
  title: 'Login ke Akun Kamu',
  registerLink: {
    text: 'Belum punya akun?',
    linkText: 'Daftar di sini',
    href: '/register',
  },
  forgotPasswordText: 'Lupa password?',
  rememberMeText: 'Ingat saya',
  submitButtonText: 'Login',
  loadingText: 'Memproses...',
  socialLoginText: 'atau',
  googleButtonText: 'Login dengan Google',
  termsText: {
    prefix: 'Dengan login, Anda menyetujui',
    terms: 'Syarat & Ketentuan',
    and: 'dan',
    privacy: 'Kebijakan Privasi',
  },
};

export const loginValidation = {
  email: {
    required: 'Email wajib diisi',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Email tidak valid',
    },
  },
  password: {
    required: 'Password wajib diisi',
  },
};
