import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddresses, deleteAddress } from '@/features/user/userSlice';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import EmptyState from '@/components/EmptyState';
import AddAddressForm from '@/components/AddAddressForm'; // Import the reusable form

// Icons
import { Trash2, PlusCircle, MapPin } from 'lucide-react';
import { toast } from 'sonner'

const AddressManagementPage = () => {
  const dispatch = useDispatch();
  const { addresses, isLoading } = useSelector((state) => state.user);

  // State to manage the dialogs
  const [isAddAddressOpen, setAddAddressOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null); // Holds the ID of the address to delete

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  // Handler for when the user confirms deletion
  const handleDeleteConfirm = () => {
    if (addressToDelete) {
      dispatch(deleteAddress(addressToDelete))
        .unwrap()
        .then(() => {
            toast.success("Address deleted successfully");
            setAddressToDelete(null); // Close the dialog
        })
        .catch((error) => {
          toast.error(`Failed to delete address: ${error.message}`);
          setAddressToDelete(null);
        });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manage Addresses</CardTitle>
            <CardDescription>Add, edit, or delete your shipping addresses.</CardDescription>
          </div>
          <Dialog open={isAddAddressOpen} onOpenChange={setAddAddressOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Shipping Address</DialogTitle>
              </DialogHeader>
              {/* Use the reusable form component */}
              <AddAddressForm setOpen={setAddAddressOpen} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Handle Empty State */}
            {!isLoading && addresses.length === 0 && (
              <EmptyState
                title="No Addresses Found"
                description="You haven't saved any shipping addresses yet."
                icon={MapPin}
                action={{
                  label: "Add Your First Address",
                  onClick: () => setAddAddressOpen(true),
                }}
              />
            )}
            
            {/* Display Saved Addresses */}
            {addresses.map((addr) => (
              <div key={addr._id} className="border rounded-md p-4 flex justify-between items-center">
                <p className="text-sm">
                  {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                </p>
                <Button variant="ghost" size="icon" onClick={() => setAddressToDelete(addr._id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog for Deletion */}
      <AlertDialog open={!!addressToDelete} onOpenChange={(open) => !open && setAddressToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this address from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AddressManagementPage;