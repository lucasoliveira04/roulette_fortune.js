import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";  
import { LoginPage } from "../pages/login";  
import { AdminPage } from "../pages/admin";
import { UserPage } from "../pages/user";
import { RegistroPage } from "../pages/registerPage";

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>  
                <Route path="/login" element={<LoginPage />} /> 
                <Route path="/roleta/admin/admin/1/2" element={<AdminPage />} />
                <Route path="/home/roleta/w/1/q" element={<UserPage />} />
                <Route path="/registrar" element={<RegistroPage/>} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
};
