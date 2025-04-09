import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminPage from '../pages/AdminPage'
import LoginPage from '../pages/LoginPage'
import LayoutPage from '../pages/LayoutPage'

function App() {
  return (
    <>
    
      <Routes>
        <Route element={<LayoutPage />}>
          <Route index element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
