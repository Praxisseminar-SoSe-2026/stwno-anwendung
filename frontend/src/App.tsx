import { Routes, Route } from 'react-router'

import { ProtectedRoute } from './components/ProtectedRoute.tsx'
//layout
import { Layout } from './components/Layout.tsx'
// resident pages
import { IndexPage } from './pages/resident/IndexPage'
import { FaqPage } from './pages/resident/FaqPage'
import { LaundryMachinesPage } from './pages/resident/LaundryMachinesPage'
import { RepairRequest } from './pages/resident/RepairRequest.tsx'
import { RoomBookingPage } from './pages/resident/RoomBookingPage'
import { AnnouncementDetailPage } from './pages/resident/AnnouncementDetailPage'
import { AdminTicketDetailPage } from './pages/admin/AdminTicketDetailPage.tsx'
import { RoomBookingCreatePage } from './pages/resident/RoomBookingCreatePage'

// admin pages
import { AdminIndexPage } from './pages/admin/AdminIndexPage'
import { AdminTicketOverviewPage } from './pages/admin/AdminTicketOverviewPage'
import { AdminCreateAnnouncementPage } from './pages/admin/AdminCreateAnnouncementPage.tsx'

//general pages
import { LoginPage } from './pages/general/LoginPage'
import { NotFoundPage } from './pages/general/NotFoundPage'

import './App.css'
import { FaqDetailPage } from './pages/resident/FaqDetailPage.tsx'
import { FaqCreatePage } from './pages/resident/FaqCreatePage.tsx'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          {/* resident routes */}
          <Route path="/" element={<IndexPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/faq/:id" element={<FaqDetailPage />}></Route>
          <Route path="/faq/neu" element={<FaqCreatePage />}></Route>
          <Route path="/waschmaschinen" element={<LaundryMachinesPage />} />
          <Route path="/reparaturanfrage" element={<RepairRequest />} />
          <Route path="/gemeinschaftsraum" element={<RoomBookingPage />} />
          <Route path="/aushang/:id" element={<AnnouncementDetailPage />} />
          <Route
            path="/gemeinschaftsraum/anfrage/:id"
            element={<RoomBookingCreatePage />}
          />
          {/* admin routes */}
          <Route path="/admin" element={<AdminIndexPage />} />
          <Route path="/admin/tickets" element={<AdminTicketOverviewPage />} />
          <Route
            path="/admin/tickets/:id"
            element={<AdminTicketDetailPage />}
          />
          <Route
            path="/aushang/neu"
            element={<AdminCreateAnnouncementPage />}
          />
          {/* general routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
