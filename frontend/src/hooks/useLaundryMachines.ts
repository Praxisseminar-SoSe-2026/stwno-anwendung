import { useEffect, useState } from 'react'
import {
  getLaundryMachines,
  type LaundryMachine,
} from '../api/getLaundryMachines'

// return list of laundry machines with their current status
export function useLaundryMachines() {
  const [machines, setMachines] = useState<LaundryMachine[]>([])

  useEffect(() => {
    getLaundryMachines().then((machines) => setMachines(machines))
  }, [])

  return machines
}
