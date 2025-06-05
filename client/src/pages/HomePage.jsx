import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '@/features/products/productSlice';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.products);

  useEffect(() => {
    // Fetch a limited number of products for the homepage
    dispatch(fetchProducts({ limit: 8 }));
  }, [dispatch]);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-20 rounded-lg bg-muted">
        <h1 className="text-5xl font-extrabold font-heading tracking-tight lg:text-6xl">
          Minimalist Style, Maximum Impact
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
          Discover our curated collection of modern essentials. Built to last, designed to impress.
        </p>
        <div className="mt-8">
          <Button size="lg" asChild>
            <Link to="/shop">Shop The Collection</Link>
          </Button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section>
        <h2 className="text-3xl font-bold font-heading text-center mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </div>
  );
};

export default HomePage;