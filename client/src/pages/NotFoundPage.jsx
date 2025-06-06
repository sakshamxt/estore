import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
  return (
    <div className="container text-center py-20">
      <h1 className="text-9xl font-extrabold font-heading tracking-tighter">404</h1>
      <p className="mt-4 text-2xl font-semibold text-muted-foreground">Page Not Found</p>
      <p className="mt-2 text-muted-foreground">Sorry, we couldn’t find the page you’re looking for.</p>
      <Button asChild className="mt-8">
        <Link to="/">Go back home</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;