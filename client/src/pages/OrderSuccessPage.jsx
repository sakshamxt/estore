import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const OrderSuccessPage = () => {
  const { orderId } = useParams();

  return (
    <div className="container text-center py-20 flex flex-col items-center">
      <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
      <h1 className="text-4xl font-bold font-heading">Order Placed Successfully!</h1>
      <p className="mt-4 text-muted-foreground">Thank you for your purchase. Your order is being processed.</p>
      <p className="mt-2 text-sm text-muted-foreground">Order ID: {orderId}</p>
      <div className="mt-8 flex gap-4">
        <Button asChild>
          <Link to="/shop">Continue Shopping</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/profile/orders">View My Orders</Link>
        </Button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;