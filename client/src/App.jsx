import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LayoutPage from './pages/LayoutPage'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './routers/ProtectedRoute'
import GamePage from './pages/GamePage'
import UsersPage from './pages/UsersPage'


function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<LayoutPage />}>
            <Route index element={<AdminPage />} />
            <Route path='/game' element={<GamePage />} />
            <Route path='/users' element={<UsersPage />} />
          </Route>
        </Route>
        {/* Резервный редирект для несуществующих путей */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>


  )
}

export default App
