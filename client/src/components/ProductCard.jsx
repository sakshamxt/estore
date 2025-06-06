import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Slices & Actions
import { addToCart } from '@/features/cart/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/features/wishlist/wishlistSlice';

// UI Components & Utilities
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { cn } from '@/lib/utils';

// Icons
import { Heart, Loader2 } from 'lucide-react';

const ProductCard = ({ product }) => {
  // Initialize hooks
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Select relevant state from Redux store
  const { isLoading: isCartLoading } = useSelector((state) => state.cart);
  const { itemIds: wishlistItems } = useSelector((state) => state.wishlist);

  // Determine if the product is already in the wishlist for UI state
  const isWishlisted = wishlistItems.includes(product._id);

  /**
   * Formats a number into Indian Rupee currency format.
   * @param {number} price - The price to format.
   * @returns {string} - The formatted price string.
   */
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  /**
   * Handles adding the product to the shopping cart.
   * Dispatches the addToCart action and shows a toast notification.
   */
  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product._id, quantity: 1 }))
      .unwrap()
      .then(() => {
        toast({
          title: "Added to Cart",
          description: `"${product.name}" is now in your cart.`,
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Failed to add",
          description: error || "Could not add item to cart.",
        });
      });
  };

  /**
   * Handles adding or removing the product from the wishlist.
   * @param {React.MouseEvent} e - The mouse event.
   */
  const handleWishlistToggle = (e) => {
    e.preventDefault(); // Prevents navigating to product page when clicking the heart
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
      toast({ title: "Removed from Wishlist" });
    } else {
      dispatch(addToWishlist(product._id));
      toast({ title: "Added to Wishlist" });
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg h-full">
      <CardHeader className="p-0 relative">
        {/* Main product image links to the detail page */}
        <Link to={`/product/${product._id}`}>
          <img
            src={product.images[0] || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-56 object-cover"
          />
        </Link>
        {/* Wishlist button positioned over the image */}
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/70 hover:bg-background"
          onClick={handleWishlistToggle}
        >
          <Heart
            className={cn(
              "h-5 w-5 text-gray-500 transition-all",
              isWishlisted && "fill-red-500 text-red-500"
            )}
          />
          <span className="sr-only">Add to Wishlist</span>
        </Button>
      </CardHeader>

      {/* Card content with product details */}
      <CardContent className="flex-grow p-4 flex flex-col">
        <p className="text-sm text-muted-foreground">{product.category.name}</p>
        <CardTitle className="text-lg font-semibold mt-1 flex-grow">
          <Link to={`/product/${product._id}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </CardTitle>
      </CardContent>

      {/* Card footer with price and add to cart button */}
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <p className="text-xl font-bold">{formatPrice(product.price)}</p>
        <Button size="sm" onClick={handleAddToCart} disabled={isCartLoading}>
          {isCartLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;