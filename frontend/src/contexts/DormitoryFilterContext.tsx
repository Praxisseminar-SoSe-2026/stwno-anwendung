import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { useDormitories } from '../hooks/useDormitories.ts'

type DormitoryFilterContextValue = {
  dormitoryFilter: string
  setDormitoryFilter: (value: string) => void
}

const DormitoryFilterContext = createContext<
  DormitoryFilterContextValue | undefined
>(undefined)

export function DormitoryFilterProvider({ children }: { children: ReactNode }) {
  const [selectedDormitoryId, setDormitoryFilter] = useState<string>('')
  const { dormitories } = useDormitories()

  const dormitoryFilter =
    selectedDormitoryId || (dormitories[0] ? String(dormitories[0].id) : '')

  return (
    <DormitoryFilterContext.Provider
      value={{ dormitoryFilter, setDormitoryFilter }}
    >
      {children}
    </DormitoryFilterContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDormitoryFilter() {
  const context = useContext(DormitoryFilterContext)
  if (context === undefined) {
    throw new Error(
      'useDormitoryFilter must be used within a DormitoryFilterProvider'
    )
  }
  return context
}
