import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  ScrollRestoration,
} from 'react-router-dom'
import { LikesProvider } from '@/context/LikesContext'
import { HomePage } from '@/pages/HomePage'
import { GameDetailPage } from '@/pages/GameDetailPage'
import { AddGamePage } from '@/pages/AddGamePage'
import { EditGamePage } from '@/pages/EditGamePage'

function RootLayout() {
  return (
    <LikesProvider>
      <ScrollRestoration />
      <Outlet />
    </LikesProvider>
  )
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/games/:id', element: <GameDetailPage /> },
      { path: '/games/:id/edit', element: <EditGamePage /> },
      { path: '/add', element: <AddGamePage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
