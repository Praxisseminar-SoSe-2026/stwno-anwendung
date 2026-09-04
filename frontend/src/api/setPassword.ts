const BASE_URL = import.meta.env.VITE_API_BASE_URL

export type SetPasswordData = {
    email: string
    password: string
}

export async function setPassword(data: SetPasswordData): Promise<void> {
    const res = await fetch(`${BASE_URL}/auth/set-password`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
}