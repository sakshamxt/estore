import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAddresses, addAddress } from '@/features/user/userSlice';
import { createOrder, verifyPayment, resetOrderState } from '@/features/order/orderSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { resetCart } from '@/features/cart/cartSlice';

// Reusable Order Summary Component
const OrderSummary = ({ cartItems }) => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingFee = 50;
  const total = subtotal + shippingFee;
  const formatPrice = (price) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);

  return (
    <Card>
      <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {cartItems.map(item => (
          <div key={item.product._id} className="flex justify-between text-sm">
            <span>{item.product.name} x {item.quantity}</span>
            <span>{formatPrice(item.product.price * item.quantity)}</span>
          </div>
        ))}
        <Separator />
        <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
        <div className="flex justify-between"><span>Shipping</span><span>{formatPrice(shippingFee)}</span></div>
        <Separator />
        <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{formatPrice(total)}</span></div>
      </CardContent>
    </Card>
  );
};

// Add New Address Form Component
const AddAddressForm = ({ setOpen }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ street: '', city: '', state: '', postalCode: '', country: 'India' });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addAddress(formData))
      .unwrap()
      .then(() => setOpen(false));
  };
  
  const handleChange = (e) => setFormData({...formData, [e.target.id]: e.target.value });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form Fields for street, city, state, postalCode */}
      {Object.keys(formData).map(key => (
        <div key={key}>
          <Label htmlFor={key} className="capitalize">{key}</Label>
          <Input id={key} value={formData[key]} onChange={handleChange} required />
        </div>
      ))}
      <Button type="submit" className="w-full">Save Address</Button>
    </form>
  );
};

// Main Checkout Page Component
const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAddAddressOpen, setAddAddressOpen] = useState(false);
  
  const { user } = useSelector(state => state.auth);
  const { items: cartItems } = useSelector(state => state.cart);
  const { addresses, isLoading: isAddressLoading } = useSelector(state => state.user);
  const { razorpayOrder, order, isLoading, isError, message } = useSelector(state => state.order);

  useEffect(() => {
    dispatch(fetchAddresses());
    dispatch(resetOrderState());
  }, [dispatch]);

  // Effect to handle Razorpay payment flow
  useEffect(() => {
    if (razorpayOrder) {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "eStore",
        description: "Test Transaction",
        order_id: razorpayOrder.id,
        handler: function (response) {
          dispatch(verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }));
        },
        prefill: { name: user.fullName, email: user.email },
        theme: { color: "#3399cc" }
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    }
  }, [razorpayOrder, dispatch, user]);
  
  // Effect to handle successful order
  useEffect(() => {
    if (order) {
      navigate(`/order-success/${order._id}`);
    }
    if (isError) {
        toast.error("Something went wrong: " + message);    
    }
  }, [order, isError, message, navigate, toast]);
  
  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      toast({ variant: "destructive", title: "No Address Selected", description: "Please select a shipping address." });
      return;
    }
    dispatch(createOrder({ shippingAddressId: selectedAddress, paymentMethod: 'RAZORPAY' }));
  };

  if (cartItems.length === 0 && !order) {
    navigate('/shop');
    return null;
  }
  
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold font-heading mb-8">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Select Shipping Address</CardTitle></CardHeader>
            <CardContent>
              {isAddressLoading ? <Loader2 className="animate-spin" /> : (
                <RadioGroup onValueChange={setSelectedAddress}>
                  <div className="space-y-4">
                    {addresses.map(addr => (
                      <Label key={addr._id} className="flex items-center gap-4 border rounded-md p-4 has-[:checked]:bg-muted">
                        <RadioGroupItem value={addr._id} id={addr._id} />
                        <div>
                          <p>{addr.street}, {addr.city}, {addr.state} - {addr.postalCode}</p>
                        </div>
                      </Label>
                    ))}
                  </div>
                </RadioGroup>
              )}
              <Dialog open={isAddAddressOpen} onOpenChange={setAddAddressOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="mt-4">Add New Address</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>New Shipping Address</DialogTitle></DialogHeader>
                  <AddAddressForm setOpen={setAddAddressOpen} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <OrderSummary cartItems={cartItems} />
            <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : `Place Order & Pay`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;