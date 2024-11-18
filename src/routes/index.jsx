import { BrowserRouter, Routes, Route } from "react-router-dom";  
import { LoginPage } from "../pages/login";  
import { AdminPage } from "../pages/admin";
import { UserPage } from "../pages/user";

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>  
                <Route path="/login" element={<LoginPage />} /> 
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/" element={<UserPage />} />
            </Routes>
        </BrowserRouter>
    );
};
