import {useAuth} from "../contexts/AuthContext.tsx";

export function useHasRole(roles: string[]): boolean {
    const {hasRole} = useAuth()
    return roles.some((role) => hasRole(role))
}