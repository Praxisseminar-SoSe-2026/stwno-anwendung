import {register, type RegistrationData, type RegistrationResponse} from '../api/registration.ts'
import {useState} from "react";

export function useRegistration() {
    const [error, setError] = useState<string | null>(null)
    const submitRegistration = async (data: RegistrationData): Promise<RegistrationResponse | null> => {
        setError(null)
        try {
            return await register(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed')
            return null
        }
    }
    return {submitRegistration, error}
}