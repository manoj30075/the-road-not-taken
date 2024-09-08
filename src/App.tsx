import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import BottomNav from './components/layout/BottomNav';
import InfoPopup from './components/InfoPopup';

function AppRoutes() {
    const location = useLocation();

    return (
        <Routes key={location.pathname}>
            <Route path="/" element={<Home key="home" />} />
            <Route path="/what-if/:question" element={<Home key="what-if" />} />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-[#FAF9F6]">
                <main className="container mx-auto px-4 py-8">
                    <AppRoutes />
                </main>
                <BottomNav />
                <InfoPopup />
            </div>
        </Router>
    );
}

export default App;