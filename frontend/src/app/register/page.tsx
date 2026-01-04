import { RegisterBranding, RegisterForm } from '@/features/register';

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex">
            <RegisterBranding />
            <RegisterForm />
        </div>
    );
}
