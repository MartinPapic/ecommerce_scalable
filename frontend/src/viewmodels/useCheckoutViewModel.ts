import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { orderService } from "@/services/order.service";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

export interface ShippingData {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
}

const INITIAL_SHIPPING_DATA: ShippingData = {
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
    country: ""
};

export function useCheckoutViewModel() {
    const router = useRouter();
    const { items, clearCart } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [shippingData, setShippingData] = useState<ShippingData>(INITIAL_SHIPPING_DATA);

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Ensure user is authenticated
    useEffect(() => {
        if (!authService.isAuthenticated()) {
            toast.error("Debes iniciar sesión para finalizar la compra");
            router.push("/login?redirect=/checkout");
        }
    }, [router]);

    const handleShippingChange = (field: keyof ShippingData, value: string) => {
        setShippingData(prev => ({ ...prev, [field]: value }));
    };

    const placeOrder = async () => {
        if (items.length === 0) {
            toast.error("El carrito está vacío");
            return;
        }

        // Validate shipping data (basic check)
        if (!Object.values(shippingData).every(val => val.trim())) {
            toast.error("Por favor completa todos los datos de envío");
            return;
        }

        setLoading(true);
        try {
            const orderItems = items.map(item => ({
                product_id: parseInt(item.id as any), // Force cast to handle number/string
                quantity: item.quantity
            }));

            const result = await orderService.createOrder(orderItems);

            if (result) {
                toast.success("¡Orden completada con éxito!");
                clearCart();
                router.push("/profile"); // Redirect to profile to see the order
            } else {
                toast.error("Error al procesar la orden");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado al procesar la orden");
        } finally {
            setLoading(false);
        }
    };

    return {
        items,
        totalAmount,
        shippingData,
        loading,
        handleShippingChange,
        placeOrder
    };
}
