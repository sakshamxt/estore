import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, reset } from '@/features/auth/authSlice';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // Get the email passed from the registration page
  const email = location.state?.email;
  const [otp, setOtp] = useState("");

  const { isAuthenticated, isLoading, isError, message } = useSelector((state) => state.auth);

  // If the user lands on this page without an email (e.g., direct navigation),
  // send them back to the register page.
  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  // Handle the result of the OTP verification
  useEffect(() => {
    if (isError) {
      toast.error(message || 'Verification failed. Please try again.');
        dispatch(reset());
    }
    // If verification is successful, the user is now authenticated.
    // Redirect them to the homepage.
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isError, message, navigate, dispatch, toast]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      dispatch(verifyOtp({ email, otp }));
    }
  };

  return (
    <div className="flex items-center justify-center py-20">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Verify Your Account</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to <strong>{email || 'your email'}</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || otp.length < 6}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOtpPage;