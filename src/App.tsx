import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Savings from './pages/Savings';
import Loans from './pages/Loans';
import LoanRequest from './pages/LoanRequest';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Testing from './pages/testing';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';

const router = createBrowserRouter(
  [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Navigate to="/dashboard" replace /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "savings", element: <Savings /> },
        { path: "loans", element: <Loans /> },
        { path: "loan-request", element: <LoanRequest /> },
        { path: "analytics", element: <Analytics /> },
        { path: "profile", element: <Profile /> },
        { path: "report", element: <Testing /> },

      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true, // ✅ Opt-in to v7 path behavior
    },
  }
);

function App(): React.ReactElement {
  return (
    <ConfigProvider locale={enUS}>
      <AuthProvider>
        <DataProvider>
          <RouterProvider router={router} />
        </DataProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
