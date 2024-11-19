import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";  
import { LoginPage } from "../pages/login";  
import { AdminPage } from "../pages/admin";
import { UserPage } from "../pages/user";
import { RegistroPage } from "../pages/registerPage";
import { RoletaPage } from "../pages/roleta";

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>  
                <Route path="/login" element={<LoginPage />} /> 
                <Route path="/roleta/admin" element={<AdminPage />} />
                <Route path="/roleta" element={<RoletaPage/>} />
                <Route path="/registrar" element={<RegistroPage/>} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
};
