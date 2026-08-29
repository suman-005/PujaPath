import { Outlet } from 'react-router-dom'
import { DocumentLangSync } from '../components/DocumentLangSync'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'

export function MainLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <DocumentLangSync />
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
