
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import AuthHeader from '@/components/auth/AuthHeader';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import BypassAuthButton from '@/components/auth/BypassAuthButton';

const Auth = () => {
  const navigate = useNavigate();
  const { user, bypassAuth } = useAuth();

  useEffect(() => {
    // Check if user is already logged in
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleAuthSuccess = () => {
    navigate('/');
  };

  const handleBypassAuth = () => {
    bypassAuth();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthHeader 
          title="Welcome Back" 
          description="Sign in to your Excel Medical Billing account" 
        />

        <Card>
          <CardHeader>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </TabsContent>
              
              <TabsContent value="signup">
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Create a new account to get started
                </CardDescription>
              </TabsContent>
            </Tabs>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsContent value="signin">
                <SignInForm onSuccess={handleAuthSuccess} />
              </TabsContent>

              <TabsContent value="signup">
                <SignUpForm />
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <Separator />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
            </div>

            <GoogleSignInButton />

            <BypassAuthButton onBypass={handleBypassAuth} loading={false} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
