import { useUser } from "../../services/providers/LoggedUserProvider";
import { useRoles } from "../../services/providers/RolesProvider";
import { useEffect, useState } from 'react';

export const useAdminStatus = () => {
    const { user } = useUser();
    const { roles } = useRoles();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (user && roles) {
            const allPossibleRoles = roles.map(role => role.name);
            const userRolesArr = user.roles?.map(role => role.name);

            if (userRolesArr) {
                const isAdminUser = userRolesArr.every(role => allPossibleRoles.includes(role));
                setIsAdmin(isAdminUser);
            }
        }
    }, [user, roles]);

    return isAdmin;
}

