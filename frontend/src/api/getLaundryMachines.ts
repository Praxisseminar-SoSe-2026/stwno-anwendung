//const BASE_URL = import.meta.env.VITE_API_BASE_URL

export type LaundryMachineStatus = 'running' | 'idle' | 'defect'
export type LaundryMachineType = 'washingmachine' | 'dryer'

export type LaundryMachine = {
  id: string
  type: LaundryMachineType
  status: LaundryMachineStatus
}

// ToDo: activate API Call with real URL when implemented in backend
/*
// call API Endpoint /laundry-machines
export async function getLaundryMachines(): Promise<LaundryMachine[]> {
  try {
    const res = await fetch(`${BASE_URL}/laundry-machines`)
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error('Fetching laundry machine data failed:', err)
    return []
  }
}
*/

// ToDo: remove placeholder when implemented in backend
export async function getLaundryMachines(): Promise<LaundryMachine[]> {
  return Promise.resolve([
    { id: 'w1', type: 'washingmachine', status: 'running' },
    { id: 'w2', type: 'washingmachine', status: 'idle' },
    { id: 'w3', type: 'washingmachine', status: 'defect' },
    { id: 'd1', type: 'dryer', status: 'idle' },
    { id: 'd2', type: 'dryer', status: 'running' },
    { id: 'd3', type: 'dryer', status: 'idle' },
  ])
}
