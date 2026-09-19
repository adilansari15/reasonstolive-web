import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { Footer } from "./components/Footer.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { WallPage } from "./pages/WallPage.jsx";
import { SharePage } from "./pages/SharePage.jsx";
import { ReasonsPage } from "./pages/ReasonsPage.jsx";
import { SupportPage } from "./pages/SupportPage.jsx";
import { AdminPage } from "./pages/AdminPage.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#141312] text-[#1C1917] dark:text-[#EDEAE4] transition-colors selection:bg-stone-800 selection:text-stone-50 dark:selection:bg-stone-200 dark:selection:text-stone-900">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/wall" element={<WallPage />} />
              <Route path="/share" element={<SharePage />} />
              <Route path="/reasons" element={<ReasonsPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
