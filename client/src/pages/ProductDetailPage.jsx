import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductBySlug, reset } from '@/features/products/productSlice';
import ProductImageGallery from '@/components/ProductImageGallery';
import StarRating from '@/components/StarRating';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { Minus, Plus, Loader2 } from 'lucide-react';
import { addToCart } from '@/features/cart/cartSlice';
import { toast } from 'sonner';

// A function to calculate average rating
const getAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const total = reviews.reduce((acc, review) => acc + review.rating, 0);
  return total / reviews.length;
};

const ProductDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const { product, isLoading, isError, message } = useSelector((state) => state.products);

  const { isLoading: isCartLoading } = useSelector((state) => state.cart);


  useEffect(() => {
    dispatch(fetchProductBySlug(slug));
    // Reset state on component unmount
    return () => {
      dispatch(reset());
    };
  }, [slug, dispatch]);


  const handleAddToCart = () => {
        dispatch(addToCart({ productId: product._id, quantity }))
          .unwrap()
          .then(() => {
            toast.success("Product added to cart successfully!");  
          })
          .catch((error) => {
            toast.error(error.message || "Failed to add product to cart.");  
          });
  };


  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError) {
    return <div className="text-center py-10 text-red-500">Error: {message}</div>;
  }

  if (!product) {
    return null; // or a "Product not found" message
  }

  const averageRating = getAverageRating(product.reviews);

  return (
    <div className="container mx-auto py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery */}
        <div>
          <ProductImageGallery images={product.images} productName={product.name} />
        </div>

        {/* Right Column: Product Info */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-primary">{product.category.name.toUpperCase()}</p>
          <h1 className="text-4xl font-bold font-heading">{product.name}</h1>
          <div className="flex items-center gap-2">
            <StarRating rating={averageRating} />
            <span className="text-sm text-muted-foreground">({product.reviews.length} reviews)</span>
          </div>
          <p className="text-3xl font-bold">{formatPrice(product.price)}</p>
          <p className="text-muted-foreground leading-relaxed">{product.description.substring(0, 150)}...</p>
          <Separator />
          <div className="flex items-center gap-4">
            <p className="font-semibold">Quantity:</p>
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={isCartLoading}>
              {isCartLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Add to Cart"}
          </Button>
        </div>
      </div>

      {/* Bottom Section: Tabs for Details & Reviews */}
      <div className="mt-12">
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-4 prose max-w-none">
            <p>{product.description}</p>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4 space-y-8">
            {product.reviews.map((review) => (
              <div key={review._id} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold">
                  {review.user.fullName.charAt(0)}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{review.user.fullName}</p>
                    <span className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <StarRating rating={review.rating} size={16} />
                  <p className="mt-2 text-muted-foreground">{review.comment}</p>
                </div>
              </div>
            ))}
            <Separator />
            {/* Add Review Form */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold font-heading">Write a Review</h3>
              <div className="space-y-2">
                <label>Your Rating</label>
                <StarRating rating={0} onRate={(rate) => console.log(rate)} />
              </div>
              <Textarea placeholder="Share your thoughts about this product..." />
              <Button>Submit Review</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const ProductDetailSkeleton = () => (
  <div className="container mx-auto py-8">
    <div className="grid md:grid-cols-2 gap-12">
      <div>
        <Skeleton className="w-full aspect-square rounded-lg" />
        <div className="grid grid-cols-5 gap-2 mt-4">
          <Skeleton className="w-full aspect-square rounded-md" />
          <Skeleton className="w-full aspect-square rounded-md" />
          <Skeleton className="w-full aspect-square rounded-md" />
          <Skeleton className="w-full aspect-square rounded-md" />
        </div>
      </div>
      <div className="space-y-6">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  </div>
);


export default ProductDetailPage;