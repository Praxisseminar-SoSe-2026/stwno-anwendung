import { Routes, Route } from 'react-router'

import { ProtectedRoute } from './components/ProtectedRoute.tsx'
//layout
import { Layout } from './components/Layout.tsx'
// resident pages
import { IndexPage } from './pages/resident/IndexPage'
import { FaqPage } from './pages/resident/FaqPage'
import { LaundryMachinesPage } from './pages/resident/LaundryMachinesPage'
import { LaundryBookingCreatePage } from './pages/resident/LaundryBookingCreatePage'
import { RepairRequestPage } from './pages/resident/RepairRequestPage.tsx'
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
import { RegistrationPage } from './pages/general/RegistrationPage'
import { SetPasswordPage } from './pages/general/SetPasswordPage'
import { NotFoundPage } from './pages/general/NotFoundPage'

import './App.css'
import { FaqDetailPage } from './pages/resident/FaqDetailPage.tsx'
import { AdminFaqCreatePage } from './pages/admin/AdminFaqCreatePage.tsx'
import { AdminCreateCommunityRoomPage } from './pages/admin/AdminCreateCommunityRoomPage.tsx'
import { AdminCommunityRoomDetailPage } from './pages/admin/AdminCommunityRoomDetailPage.tsx'
import { AdminCreateLaundryRoomPage } from './pages/admin/AdminCreateLaundryRoomPage.tsx'
import { AdminLaundryRoomDetailPage } from './pages/admin/AdminLaundryRoomDetailPage.tsx'
import { AdminCreateLaundryMachinePage } from './pages/admin/AdminCreateLaundryMachinePage.tsx'
import { AdminLaundryMachineDetailPage } from './pages/admin/AdminLaundryMachineDetailPage.tsx'
import { AdminCreateDormitoryPage } from './pages/admin/AdminCreateDormitoryPage.tsx'
import { AdminDormitoryDetailPage } from './pages/admin/AdminDormitoryDetailPage.tsx'
import { AdminUserListPage } from './pages/admin/AdminUserListPage.tsx'
import { AdminUserListDetailPage } from './pages/admin/AdminUserListDetailPage.tsx'
import { TicketsPage } from './pages/resident/TicketPage.tsx'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registration" element={<RegistrationPage />} />
      <Route path="/set-password" element={<SetPasswordPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          {/* resident routes */}
          <Route path="/" element={<IndexPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/faq/:id" element={<FaqDetailPage />}></Route>
          <Route path="/waschmaschinen" element={<LaundryMachinesPage />} />
          <Route
            path="/waschmaschinen/nutzen/:id"
            element={<LaundryBookingCreatePage />}
          />
          <Route path="/reparaturanfrage" element={<RepairRequestPage />} />
          <Route path="/gemeinschaftsraum" element={<RoomBookingPage />} />
          <Route path="/aushang/:id" element={<AnnouncementDetailPage />} />
          <Route
            path="/gemeinschaftsraum/anfrage/:id"
            element={<RoomBookingCreatePage />}
          />
          <Route path="/meine-tickets" element={<TicketsPage />} />
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
          <Route path="/faq/neu" element={<AdminFaqCreatePage />}></Route>
          <Route
            path="/gemeinschaftsraum/neu"
            element={<AdminCreateCommunityRoomPage />}
          />
          <Route
            path="/gemeinschaftsraum/:id"
            element={<AdminCommunityRoomDetailPage />}
          />
          <Route
            path="/waschmaschinen/waschraum/neu"
            element={<AdminCreateLaundryRoomPage />}
          />
          <Route
            path="/waschmaschinen/waschraum/:id"
            element={<AdminLaundryRoomDetailPage />}
          />
          <Route
            path="/waschmaschinen/waschraum/:roomId/maschine/neu"
            element={<AdminCreateLaundryMachinePage />}
          />
          <Route
            path="/waschmaschinen/waschraum/:roomId/maschine/:id"
            element={<AdminLaundryMachineDetailPage />}
          />
          <Route path="/dormitory/neu" element={<AdminCreateDormitoryPage />} />
          <Route path="/dormitory/:id" element={<AdminDormitoryDetailPage />} />
          <Route path="/admin/users" element={<AdminUserListPage />} />
          <Route
            path="/admin/users/:id"
            element={<AdminUserListDetailPage />}
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
