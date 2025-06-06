import { NavLink, Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';

const profileNavLinks = [
  { name: 'Profile', href: '/profile', end: true },
  { name: 'My Orders', href: '/profile/orders' },
  { name: 'Manage Addresses', href: '/profile/addresses' },
  { name: 'My Wishlist', href: '/profile/wishlist' },
];

const ProfileLayout = () => {
  return (
    <div className="container my-12">
      <div className="grid lg:grid-cols-4 gap-8">
        <aside>
          <nav className="flex flex-col space-y-2">
            {profileNavLinks.map(link => (
              <NavLink
                key={link.name}
                to={link.href}
                end={link.end}
                className={({ isActive }) => cn(
                  "py-2 px-4 rounded-md text-sm font-medium transition-colors",
                  isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                )}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="lg:col-span-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProfileLayout;