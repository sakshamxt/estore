import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ProductCard = ({ product }) => {
  // Function to format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.images[0] || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <p className="text-sm text-muted-foreground">{product.category.name}</p>
        <CardTitle className="text-lg font-semibold mt-1">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </CardTitle>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <p className="text-xl font-bold">{formatPrice(product.price)}</p>
        <Button size="sm">Add to Cart</Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;