import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchWishlist } from '@/features/wishlist/wishlistSlice';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import EmptyState from '@/components/EmptyState';

// Icons
import { HeartCrack } from 'lucide-react';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, isLoading } = useSelector((state) => state.wishlist);

  // Fetch wishlist on component mount. While this is also fetched in MainLayout,
  // fetching here ensures data is present if the user navigates directly to this page.
  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  // Handler for the EmptyState action button
  const handleBrowseProducts = () => {
    navigate('/shop');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Wishlist</CardTitle>
        <p className="text-sm text-muted-foreground">
          Your saved items for later.
        </p>
      </CardHeader>
      <CardContent>
        {/* 1. Handle Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* 2. Handle Empty State */}
        {!isLoading && items.length === 0 && (
          <EmptyState
            title="Your Wishlist is Empty"
            description="Looks like you haven't added anything yet. Go find something you love!"
            icon={HeartCrack}
            action={{
              label: 'Browse Products',
              onClick: handleBrowseProducts,
            }}
          />
        )}

        {/* 3. Display Wishlisted Items */}
        {!isLoading && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WishlistPage;