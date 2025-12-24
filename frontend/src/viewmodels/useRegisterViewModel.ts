import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

export function useRegisterViewModel() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);
        try {
            const success = await authService.register(formData.email, formData.password);
            if (success) {
                toast.success("Cuenta creada exitosamente");
                // Auto-login or redirect to login
                // User asked for "sign up page... appears when clicking on profile... only when not logged in"
                // Usually good UX is to login immediately or redirect to login. 
                // Let's redirect to login for now to keep flow simple and secure.
                router.push("/login?registered=true");
            } else {
                toast.error("Error al crear cuenta. El email puede ya estar registrado.");
            }
        } catch (error) {
            toast.error("Ha ocurrido un error inesperado.");
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        loading,
        handleChange,
        handleRegister
    };
}
