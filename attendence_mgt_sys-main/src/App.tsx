import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn } from '@clerk/clerk-react';
import { ToastProvider } from './contexts/ToastContext';

import Home from './pages/Home';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import HODDashboard from './pages/hod/HODDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />

          {/* Student Routes */}
          <Route
            path="/student/*"
            element={
              <SignedIn>
                <StudentDashboard />
              </SignedIn>
            }
          />

          {/* Teacher Routes */}
          <Route
            path="/teacher/*"
            element={
              <SignedIn>
                <TeacherDashboard />
              </SignedIn>
            }
          />

          {/* HOD Routes */}
          <Route
            path="/hod/*"
            element={
              <SignedIn>
                <HODDashboard />
              </SignedIn>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <SignedIn>
                <AdminDashboard />
              </SignedIn>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
