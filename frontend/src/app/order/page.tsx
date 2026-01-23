import { OrderBranding, OrderForm } from '@/features/order';

export default function OrderPage() {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            <OrderBranding />
            <OrderForm />
        </div>
    );
}
