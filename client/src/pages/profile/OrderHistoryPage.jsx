import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '@/features/order/orderSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const OrderHistoryPage = () => {
    const dispatch = useDispatch();
    const { orders, isLoading } = useSelector(state => state.order);

    useEffect(() => {
        dispatch(fetchMyOrders());
    }, [dispatch]);

    return (
        <Card>
            <CardHeader><CardTitle>My Orders</CardTitle></CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {orders.map(order => (
                        <AccordionItem value={order._id} key={order._id}>
                            <AccordionTrigger>
                                <div className="flex justify-between w-full pr-4">
                                    <span>Order #{order._id.substring(0, 8)}</span>
                                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                    <span>₹{order.totalAmount}</span>
                                    <span className="capitalize">{order.status}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                {order.items.map(item => <div key={item._id}>{item.product.name} x {item.quantity}</div>)}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
};
export default OrderHistoryPage;