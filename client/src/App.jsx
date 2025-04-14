import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LayoutPage from './pages/LayoutPage'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <>

      <Routes>
        <Route element={<LayoutPage />}>
          <Route index element={<AdminPage />} />

        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>


  )
}

export default App
