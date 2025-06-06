import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addAddress } from '@/features/user/userSlice';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * A reusable form for adding a new address.
 * @param {{ setOpen: (isOpen: boolean) => void }} props - Props to control the parent dialog.
 */
const AddAddressForm = ({ setOpen }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addAddress(formData))
      .unwrap()
      .then(() => {
        toast({ title: "Success", description: "New address has been saved." });
        setOpen(false); // Close the dialog on successful submission
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error || "Could not save the address.",
        });
      });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="street">Street Address</Label>
        <Input id="street" value={formData.street} onChange={handleChange} placeholder="123 Main St" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" value={formData.city} onChange={handleChange} placeholder="Mumbai" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="state">State</Label>
          <Input id="state" value={formData.state} onChange={handleChange} placeholder="Maharashtra" required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input id="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="400001" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" value={formData.country} onChange={handleChange} disabled />
        </div>
      </div>
      <Button type="submit" className="w-full mt-4">Save Address</Button>
    </form>
  );
};

export default AddAddressForm;