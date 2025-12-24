import { useState, useEffect } from "react";
import { adminUserService } from "@/services/admin-user.service";
import { AdminUser, SecurityLog, SupportTicket } from "@/models/admin-user";

export function useAdminUserViewModel() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
    const [tickets, setTickets] = useState<SupportTicket[]>([]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await adminUserService.getUsers();
            setUsers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserDetails = async (id: number) => {
        setLoading(true);
        try {
            const user = await adminUserService.getUserById(id);
            setSelectedUser(user);

            // Parallel fetch for sub-data
            const [logs, userTickets] = await Promise.all([
                adminUserService.getSecurityLogs(id),
                adminUserService.getSupportTickets(id)
            ]);

            setSecurityLogs(logs);
            setTickets(userTickets);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Auto-fetch list if not specifically asking for detail only (optimization possible)
        // For now, components call fetchUsers manually or we do it here if path matches.
        // We'll leave it manual for flexibility.
    }, []);

    return {
        users,
        selectedUser,
        securityLogs,
        tickets,
        loading,
        fetchUsers,
        fetchUserDetails
    };
}
