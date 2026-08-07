'use client'

import Cards from './components/Cards'
import { DataTable } from './components/Dashtable'
import Navbar from './components/Navbar'
import CreateLinkDialog from './components/CreateLinkDialog'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { PageTransition } from '@/components/ui/motion-primitives'
import { useAuth } from '@/context/AuthContext'
import { useDashboard } from '@/hooks/useDashboard'

const DashboardPage = () => {
  const { isAuthenticated } = useAuth()
  const { forms, cardData } = useDashboard({ enabled: isAuthenticated })

  return (
    <ProtectedRoute requireApproval={true}>
      {/* bg-surface-page, not the old bg-[var(--primary-50)]/4 — Tailwind v4
          does not apply an opacity modifier to an arbitrary var() value, so
          that class resolved to nothing and the page had no background. */}
      <div className="min-h-dvh bg-surface-page">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Navbar />
          <PageTransition>
            <Cards cardData={cardData} />
            <div className="my-5 flex justify-end">
              <CreateLinkDialog />
            </div>
            <DataTable formData={forms} />
          </PageTransition>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default DashboardPage
