import type { Metadata } from 'next';
import { OrderBranding, OrderForm } from '@/features/order';

export const metadata: Metadata = {
    title: 'Pesan Jasa Coding',
    description: 'Pesan jasa pembuatan website, aplikasi, dan sistem profesional bersama tim Codelab. Konsultasi gratis, pengerjaan cepat, dan hasil berkualitas.',
    alternates: { canonical: '/order' },
};

export default function OrderPage() {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            <OrderBranding />
            <OrderForm />
        </div>
    );
}
