import { LoginBranding, LoginForm } from '@/features/login';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex">
            <LoginBranding />
            <LoginForm />
        </div>
    );
}
