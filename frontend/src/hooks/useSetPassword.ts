import {setPassword, type SetPasswordData} from "../api/setPassword.ts";
import {useState} from "react";

export function useSetPassword() {
  const [error, setError] = useState<string | null>(null)
  const submitSetPassword = async (data: SetPasswordData): Promise<boolean> => {
    setError(null)
    try {
      await setPassword(data)
      return true
    } catch (err){
      setError(err instanceof Error ? err.message : 'Setting password failed')
      return false
    }
  }
  return {submitSetPassword, error}
}