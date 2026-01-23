// Login Feature Data

export const loginBranding = {
  title: 'Lanjutkan Petualanganmu!',
  subtitle: 'Login untuk melanjutkan progress belajar & gamifikasi coding-mu.',
  features: [
    'Lanjutkan misi dan raih XP',
    'Akses materi & interaksi mentor',
    'Pantau leaderboard & achievement',
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
