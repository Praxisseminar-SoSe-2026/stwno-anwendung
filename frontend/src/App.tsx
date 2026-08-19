import { Routes, Route } from 'react-router'

//layout
import { Layout } from './components/Layout.tsx'
// resident pages
import { IndexPage } from './pages/resident/IndexPage'
import { FaqPage } from './pages/resident/FaqPage'
import { LaundryMachinesPage } from './pages/resident/LaundryMachinesPage'
import { ReparaturanfragePage } from './pages/resident/ReparaturanfragePage'
import { RoomBookingPage } from './pages/resident/RoomBookingPage'
import { AnnouncementDetailPage } from './pages/resident/AnnouncementDetailPage'

// admin pages
import { AdminIndexPage } from './pages/admin/AdminIndexPage'
import { AdminTicketOverviewPage } from './pages/admin/AdminTicketOverviewPage'

//general pages
import { LoginPage } from './pages/general/LoginPage'
import { NotFoundPage } from './pages/general/NotFoundPage'

import './App.css'
import { FaqDetailPage } from './pages/resident/FaqDetailPage.tsx'
import { FaqCreatePage } from './pages/resident/FaqCreatePage.tsx'

function App() {
  return (
    <Routes>
      {/* resident routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<IndexPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/faq/:id" element={<FaqDetailPage />}></Route>
        <Route path="/faq/neu" element={<FaqCreatePage />}></Route>
        <Route path="/waschmaschinen" element={<LaundryMachinesPage />} />
        <Route path="/reparaturanfrage" element={<ReparaturanfragePage />} />
        <Route path="/gemeinschaftsraum" element={<RoomBookingPage />} />
        <Route path="/aushang/:id" element={<AnnouncementDetailPage />} />
        {/* admin routes */}
        <Route path="/admin" element={<AdminIndexPage />} />
        <Route path="/admin/tickets" element={<AdminTicketOverviewPage />} />
        {/* general routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
