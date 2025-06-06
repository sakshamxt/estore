import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'sonner';
import { useEffect } from 'react';

const AdminRoute = () => {
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('Access denied. Admins only.');
    }
  }, [user, toast]);
  
  // Check if user exists and if their role is 'admin'
  if (user && user.role === 'admin') {
    return <Outlet />; // If yes, render the child component (e.g., AdminLayout)
  }
  
  // If not, redirect to the homepage
  return <Navigate to="/" replace />;
};

export default AdminRoute;