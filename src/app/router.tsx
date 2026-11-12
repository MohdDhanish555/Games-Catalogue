import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LikesProvider } from '@/context/LikesContext'
import { HomePage } from '@/pages/HomePage'
import { GameDetailPage } from '@/pages/GameDetailPage'
import { AddGamePage } from '@/pages/AddGamePage'
import { EditGamePage } from '@/pages/EditGamePage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <LikesProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/games/:id" element={<GameDetailPage />} />
          <Route path="/games/:id/edit" element={<EditGamePage />} />
          <Route path="/add" element={<AddGamePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LikesProvider>
    </BrowserRouter>
  )
}
