import type { Metadata } from 'next'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

export const metadata: Metadata = {
  title: 'Super Admin Control Center — NSVAIR Diagnosis',
  description: 'Manage diagnostic catalog, products, prices, stock, and clinical dispatch settings.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminPage() {
  return <AdminDashboard />
}
