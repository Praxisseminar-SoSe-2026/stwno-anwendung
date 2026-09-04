import {register, type RegistrationData, type RegistrationResponse} from '../api/registration.ts'

export function useRegistration() {
    return async (data: RegistrationData): Promise<RegistrationResponse> => {
        return await register(data)
    }
}