import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Toaster } from "@/components/ui/sonner" // Import Toaster

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-8">
        <Outlet /> {/* Child routes will be rendered here */}
      </main>
      <Footer />
      <Toaster /> {/* Add Toaster here */}
    </div>
  );
};

export default MainLayout;