import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Loader2, Minus, Plus, Trash2 } from 'lucide-react';
import { updateCartItem, removeCartItem } from '@/features/cart/cartSlice';

const CartPage = () => {
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector((state) => state.cart);

  const handleQuantityChange = (productId, quantity) => {
    if (quantity >= 1) {
      dispatch(updateCartItem({ productId, quantity }));
    }
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeCartItem(productId));
  };

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingFee = 50; // Or some logic for free shipping
  const total = subtotal + shippingFee;

  const formatPrice = (price) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);

  if (isLoading && items.length === 0) {
    return <div className="container py-12 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin" /></div>;
  }

  if (items.length === 0) {
    return (
      <div className="container text-center py-20">
        <h1 className="text-4xl font-bold font-heading">Your Cart is Empty</h1>
        <p className="mt-4 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild className="mt-6">
          <Link to="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold font-heading mb-8">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.product._id} className="flex items-center p-4">
              <img src={item.product.images[0]} alt={item.product.name} className="w-24 h-24 object-cover rounded-md" />
              <div className="ml-4 flex-grow">
                <p className="font-semibold">{item.product.name}</p>
                <p className="text-sm text-muted-foreground">{formatPrice(item.product.price)}</p>
                <div className="flex items-center mt-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}><Minus className="h-4 w-4" /></Button>
                  <Input type="number" readOnly value={item.quantity} className="w-12 h-8 text-center border-x-0" />
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}><Plus className="h-4 w-4" /></Button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatPrice(item.product.price * item.quantity)}</p>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive mt-2" onClick={() => handleRemoveItem(item.product._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatPrice(shippingFee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;