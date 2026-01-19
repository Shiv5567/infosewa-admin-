
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import PostDetail from './pages/PostDetail';
import Admin from './pages/Admin';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:catName" element={<CategoryPage />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
