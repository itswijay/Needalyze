'use client'

import Cards from './components/Cards'
import { DataTable } from './components/Dashtable'
import Navbar from './components/Navbar'
import CreateLinkDialog from './components/CreateLinkDialog'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/context/AuthContext'
import { useDashboard } from '@/hooks/useDashboard'

const DashboardPage = () => {
  const { isAuthenticated } = useAuth()
  const { forms, cardData } = useDashboard({ enabled: isAuthenticated })

  return (
    <ProtectedRoute requireApproval={true}>
      <div className="bg-[var(--primary-50)]/4">
        <div className="min-h-screen max-w-7xl px-6 py-2 md:px-6 md:py-2 lg:px-10 lg:py-2 mx-auto">
          <Navbar />
          <Cards cardData={cardData} />
          <div className=" flex justify-end my-4">
            <CreateLinkDialog />
          </div>
          <DataTable formData={forms} />
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default DashboardPage
