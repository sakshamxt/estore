import { ShoppingCart, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold font-heading">
          eStore
        </Link>
        
        {/* Navigation */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-foreground/80 transition-colors">Home</Link>
          <Link to="/shop" className="hover:text-foreground/80 transition-colors">Shop</Link>
          <Link to="/about" className="hover:text-foreground/80 transition-colors">About</Link>
          <Link to="/contact" className="hover:text-foreground/80 transition-colors">Contact</Link>
        </nav>
        
        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            <Link to="/login" className='flex items-center'>
              <User className="h-4 w-4 mr-2" />
              Login
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;