
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HeaderController from "./components/layout/HeaderController.js";
import { ToastProvider } from './components/common/Toast.js';
import Footer from "./components/layout/Footer";
import Home from "./pages/Home.js";
import Login from "./pages/Login/Login.js";
import Unlock from "./pages/Login/Unlock.js";
import NoticeList from "./pages/Notice/NoticeList.js"
import NoticeDetail from "./pages/Notice/NoticeDetail.js"
import Guide from "./_guide.js";

const App = () => {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <ToastProvider>
            <HeaderController />
            <Routes>
                {/* 루트 경로를 /login으로 리다이렉트 */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/login" element={<Login />} />
                <Route path="/login/Unlock" element={<Unlock />} />
                <Route path="/home" element={<Home />} />
                <Route path="/notice" element={<NoticeList />} />
                <Route path="/notice/detail/:id" element={<NoticeDetail />} />
                <Route path="/guide" element={<Guide />} />
            </Routes>
            <Footer />
            </ToastProvider>
        </BrowserRouter>
    );
};
export default App;