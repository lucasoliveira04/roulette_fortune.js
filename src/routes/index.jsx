import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";  
import { LoginPage } from "../pages/login";  
import { AdminPage } from "../pages/admin";
import { UserPage } from "../pages/user";
import { RegistroPage } from "../pages/registerPage";

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>  
                <Route path="/login/w/w/e" element={<LoginPage />} /> 
                <Route path="/roleta/admin/q/1/?/w/e" element={<AdminPage />} />
                <Route path="/wwww" element={<UserPage />} />
                <Route path="/registrar" element={<RegistroPage/>} />
                <Route path="*" element={<Navigate to="/roleta/admin/q/1/?/w/e" />} />
            </Routes>
        </BrowserRouter>
    );
};
