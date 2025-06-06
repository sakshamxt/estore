import { lazy, Suspense } from 'react'; // Import lazy and Suspense
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainLayout from './layouts/MainLayout';
import ProfileLayout from './layouts/ProfileLayout';
import { Loader2 } from 'lucide-react';

// Lazy load all page components
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'));
const OrderHistoryPage = lazy(() => import('./pages/profile/OrderHistoryPage'));
const AddressManagementPage = lazy(() => import('./pages/profile/AddressManagementPage'));
const WishlistPage = lazy(() => import('./pages/profile/WishlistPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage')); // Import NotFoundPage
const VerifyOtpPage = lazy(() => import('./pages/VerifyOtpPage'));

// Simple full-page loader for Suspense fallback
const FullPageLoader = () => (
  <div className="h-screen w-screen flex items-center justify-center">
    <Loader2 className="h-12 w-12 animate-spin text-primary" />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      {/* Wrap all routes in Suspense */}
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="product/:slug" element={<ProductDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
             <Route path="verify-otp" element={<VerifyOtpPage />} />
            
            {/* Protected Routes */}
            <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="order-success/:orderId" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
            
            <Route path="profile" element={<ProtectedRoute><ProfileLayout /></ProtectedRoute>}>
              <Route index element={<ProfilePage />} />
              <Route path="orders" element={<OrderHistoryPage />} />
              <Route path="addresses" element={<AddressManagementPage />} />
              <Route path="wishlist" element={<WishlistPage />} />
            </Route>
            
            {/* Catch-all 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;