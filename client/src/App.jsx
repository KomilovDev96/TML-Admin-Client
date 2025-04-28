import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LayoutPage from './pages/LayoutPage'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './routers/ProtectedRoute'
import GamePage from './pages/GamePage'
import UsersPage from './pages/UsersPage'
import GameCretePage from './pages/GamePage/CretePage'
import TransactionsPage from './pages/TransactionsPage'
import StepsPage from './pages/StepsPage'
import ParticipantsPage from './pages/GamePage/ParticipantsPage'
import MessagesPage from './pages/MessagesPage'
import SendMessageForm from './pages/MessagesPage/SendMessage'


function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<LayoutPage />}>
            <Route index element={<AdminPage />} />
            <Route path='/games' element={<GamePage />} />
            <Route path='/game/create' element={<GameCretePage />} />
            <Route path='/users' element={<UsersPage />} />
            <Route path='/trans' element={<TransactionsPage />} />
            <Route path='/messagecreate' element={<MessagesPage />} />
            <Route path='/steps' element={<StepsPage />} />
            <Route path='/partic' element={<ParticipantsPage />} />
            <Route path='/message' element={<SendMessageForm />} />
          </Route>
        </Route>
        {/* Резервный редирект для несуществующих путей */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
