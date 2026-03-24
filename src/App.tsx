import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { CatalogPage } from './pages/CatalogPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { SalesPage } from './pages/SalesPage.tsx';
import { NotificationsPage } from './pages/NotificationsPage.tsx';
import { AuthPage } from './pages/AuthPage.tsx';
import { ProtectedRoute } from './layouts/ProtectedRoute.tsx';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export const App = () => {
  return (
    <>
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={
              <AuthPage/>
          }/>
          
         
          <Route path="/catalog" element={
            <ProtectedRoute>
             <CatalogPage/>
           </ProtectedRoute>
          }/>

           <Route path="/sales" element={
             <ProtectedRoute>
              <SalesPage/>
            </ProtectedRoute> 
           }/>

           <Route path="/notifications" element={
             <ProtectedRoute>
              <NotificationsPage/>
            </ProtectedRoute> 
           }/>

            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage/>
              </ProtectedRoute> 
            }/>

      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={3000}
      />
    </BrowserRouter>

    </>
  );
};
