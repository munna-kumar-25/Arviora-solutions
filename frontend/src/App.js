import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { ChatbotProvider } from './context/ChatbotContext';
import Navbar from './components/Navbar';
import { Footer } from './components/Utils';
import ChatbotWidget from './components/ChatbotWidget';
import ContactWidgets from './components/ContactWidgets';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import BookDemo from './pages/BookDemo';
import PrivacyLanding from './pages/PrivacyLanding';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';

function App() {
    return (
        <ThemeProvider>
            <AppProvider>
                <ChatbotProvider>
                    <Router>
                        <Routes>
                            <Route
                                path="/*"
                                element={
                                    <>
                                        <Navbar />
                                        <Routes>
                                            <Route path="/" element={<Home />} />
                                            <Route path="/about" element={<About />} />
                                            <Route path="/services" element={<Services />} />
                                            <Route path="/service/:serviceName" element={<ServiceDetail />} />
                                            <Route path="/blog" element={<Blog />} />
                                            <Route path="/blog/:id" element={<BlogDetail />} />
                                            <Route path="/contact" element={<Contact />} />
                                            <Route path="/book-demo" element={<BookDemo />} />
                                            <Route path="/privacy" element={<PrivacyLanding />} />
                                            <Route path="/terms" element={<TermsOfService />} />
                                            <Route path="/cookies" element={<CookiePolicy />} />
                                            <Route
                                                path="*"
                                                element={
                                                    <div className="min-h-screen flex items-center justify-center">
                                                        <div className="text-center">
                                                            <h1 className="text-4xl font-bold text-dark mb-4">Page Not Found</h1>
                                                            <a href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
                                                                Go back home
                                                            </a>
                                                        </div>
                                                    </div>
                                                }
                                            />
                                        </Routes>
                                        <Footer />
                                    </>
                                }
                            />
                        </Routes>
                        <ChatbotWidget />
                        <ContactWidgets />
                    </Router>
                </ChatbotProvider>
            </AppProvider>
        </ThemeProvider>
    );
}

export default App;
