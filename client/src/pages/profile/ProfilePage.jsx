import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// Icons
import { ShoppingBag, MapPin, Heart } from 'lucide-react';

const ProfilePage = () => {
  // Get user information from the Redux auth state
  const { user } = useSelector((state) => state.auth);

  // A fallback in case the component renders before the user data is available
  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold font-heading">
            Welcome back, {user.fullName}!
          </CardTitle>
          <CardDescription>
            This is your personal dashboard. Here you can view your recent activity and manage your account details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user._id}</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links Card */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="h-20 justify-start p-4" asChild>
            <Link to="/profile/orders">
              <ShoppingBag className="h-6 w-6 mr-4" />
              <div className="text-left">
                <p className="font-semibold">My Orders</p>
                <p className="text-xs text-muted-foreground">Track your order history</p>
              </div>
            </Link>
          </Button>

          <Button variant="outline" className="h-20 justify-start p-4" asChild>
            <Link to="/profile/addresses">
              <MapPin className="h-6 w-6 mr-4" />
              <div className="text-left">
                <p className="font-semibold">Manage Addresses</p>
                <p className="text-xs text-muted-foreground">Edit your shipping details</p>
              </div>
            </Link>
          </Button>

          <Button variant="outline" className="h-20 justify-start p-4" asChild>
            <Link to="/profile/wishlist">
              <Heart className="h-6 w-6 mr-4" />
              <div className="text-left">
                <p className="font-semibold">My Wishlist</p>
                <p className="text-xs text-muted-foreground">View your saved items</p>
              </div>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;