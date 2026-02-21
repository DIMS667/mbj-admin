// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

import Login            from './pages/Login'
import Dashboard        from './pages/Dashboard'
import ArticlesList     from './pages/articles/ArticlesList'
import ArticleForm      from './pages/articles/ArticleForm'
import PublicationsList from './pages/publications/PublicationsList'
import PublicationForm  from './pages/publications/PublicationForm'
import BoutiqueList     from './pages/boutique/BoutiqueList'
import BoutiqueForm     from './pages/boutique/BoutiqueForm'
import CategoriesList   from './pages/categories/CategoriesList'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protégées */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/articles" element={
            <ProtectedRoute><Layout><ArticlesList /></Layout></ProtectedRoute>
          } />
          <Route path="/articles/new" element={
            <ProtectedRoute><Layout><ArticleForm /></Layout></ProtectedRoute>
          } />
          <Route path="/articles/:id/edit" element={
            <ProtectedRoute><Layout><ArticleForm /></Layout></ProtectedRoute>
          } />

          <Route path="/publications" element={
            <ProtectedRoute><Layout><PublicationsList /></Layout></ProtectedRoute>
          } />
          <Route path="/publications/new" element={
            <ProtectedRoute><Layout><PublicationForm /></Layout></ProtectedRoute>
          } />
          <Route path="/publications/:id/edit" element={
            <ProtectedRoute><Layout><PublicationForm /></Layout></ProtectedRoute>
          } />

          <Route path="/boutique" element={
            <ProtectedRoute><Layout><BoutiqueList /></Layout></ProtectedRoute>
          } />
          <Route path="/boutique/new" element={
            <ProtectedRoute><Layout><BoutiqueForm /></Layout></ProtectedRoute>
          } />
          <Route path="/boutique/:id/edit" element={
            <ProtectedRoute><Layout><BoutiqueForm /></Layout></ProtectedRoute>
          } />

          <Route path="/categories" element={
            <ProtectedRoute><Layout><CategoriesList /></Layout></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}