import {setPassword, type SetPasswordData} from "../api/setPassword.ts";

export function useSetPassword() {
  return async (data: SetPasswordData): Promise<boolean> => {
    try {
      await setPassword(data)
      return true
    } catch {
      return false
    }
  }
}