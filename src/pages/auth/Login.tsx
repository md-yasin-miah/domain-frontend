import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/store/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';

export default function Login() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const { signIn, signUp, user, loading } = useAuth();
  const { primaryRole } = useUserRole();
  const { toast } = useToast();

  const loginSchema = z.object({
    email: z.string().email(t('auth.login_page.invalid_email')),
    password: z.string().min(6, t('auth.login_page.password_min_length')),
  });

  const signupSchema = z.object({
    email: z.string().email(t('auth.login_page.invalid_email')),
    password: z.string().min(6, t('auth.login_page.password_min_length')),
  });

  type LoginFormData = z.infer<typeof loginSchema>;
  type SignupFormData = z.infer<typeof signupSchema>;

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Helper function to redirect based on role
  const redirectBasedOnRole = useCallback((role: string) => {
    const normalizedRole = role.toLowerCase();
    switch (normalizedRole) {
      case 'admin':
        navigate('/admin/dashboard', { replace: true });
        break;
      case 'support':
        navigate('/support/dashboard', { replace: true });
        break;
      case 'accounts':
        navigate('/accounts/dashboard', { replace: true });
        break;
      case 'customer':
      default:
        navigate('/client/dashboard', { replace: true });
        break;
    }
  }, [navigate]);

  // Redirect authenticated users away from login page
  useEffect(() => {
    if (user && !loading && primaryRole) {
      redirectBasedOnRole(primaryRole);
    }
  }, [user, loading, primaryRole, redirectBasedOnRole]);

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const signInResult = await signIn(data.email, data.password);
      const { error, user: signedInUser, profileCompletion } = signInResult as {
        error: { message: string } | null;
        user: any;
        profileCompletion?: { completion_percentage: number; is_complete: boolean; missing_fields: string[] } | null;
      };

      if (error) {
        // Error message is already extracted and formatted by useAuth hook
        setError(error.message || t('auth.login_page.unexpected_error'));
        return;
      }

      toast({
        title: t('auth.login_page.welcome_back'),
        description: t('auth.login_page.login_success'),
      });

      // Check profile completion first
      const completionPercentage = profileCompletion?.completion_percentage ?? 100;

      // If profile is not complete (less than 100%), redirect to profile setup
      if (completionPercentage < 100) {
        navigate('/client/profile-setup', { replace: true });
        return;
      }

      // Profile is complete, redirect based on role from API response
      if (signedInUser && signedInUser.roles && signedInUser.roles.length > 0) {
        // Handle both formats: array of strings ["admin"] or array of objects [{name: "admin"}]
        const roles = signedInUser.roles;
        const roleNames = roles.map((r: string | { name: string }) =>
          typeof r === 'string' ? r.toLowerCase() : (r?.name || '').toLowerCase()
        );

        // Prioritize admin role
        const adminRole = roleNames.find((r: string) => r === 'admin');
        const primaryRole = adminRole || roleNames[0] || 'customer';

        switch (primaryRole) {
          case 'admin':
            navigate('/admin/dashboard', { replace: true });
            break;
          case 'support':
            navigate('/support/dashboard', { replace: true });
            break;
          case 'accounts':
            navigate('/accounts/dashboard', { replace: true });
            break;
          case 'customer':
          default:
            navigate('/client/dashboard', { replace: true });
            break;
        }
      } else {
        // Fallback: if no roles, go to client dashboard
        navigate('/client/dashboard', { replace: true });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('auth.login_page.unexpected_error');
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signUp(data.email, data.password);

      if (error) {
        // Error message is already extracted and formatted by useAuth hook
        // Check for specific cases that need special handling
        if (error.message?.toLowerCase().includes('already registered') ||
          error.message?.toLowerCase().includes('user already exists')) {
          setActiveTab('login');
          loginForm.setValue('email', data.email);
        }
        setError(error.message || t('auth.login_page.unexpected_error'));
        return;
      }

      toast({
        title: t('auth.login_page.account_created'),
        description: t('auth.login_page.account_created_desc'),
      });

      // Switch to login tab
      setActiveTab('login');
      loginForm.setValue('email', data.email);
      signupForm.reset();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('auth.login_page.unexpected_error');
      setError(errorMessage);
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('auth.login_page.back_to_home')}
          </Link>
          <h1 className="text-3xl font-bold">Adominioz</h1>
          <p className="text-muted-foreground">
            {t('Login and Register to access your personal dashboard')}
          </p>
        </div>

        <Card className="border-2">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">{t('auth.login_page.welcome')}</CardTitle>
            <CardDescription className="text-center">
              {t('auth.login_page.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  {t('auth.login_page.login')}
                </TabsTrigger>
                <TabsTrigger value="signup" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  {t('auth.login_page.signup')}
                </TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="login" className="space-y-4 mt-0">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('auth.login_page.email')}</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder={t('auth.login_page.email_placeholder')}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('auth.login_page.password')}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder={t('auth.login_page.password_placeholder')}
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('auth.login_page.signing_in')}
                        </>
                      ) : (
                        <>
                          <LogIn className="mr-2 h-4 w-4" />
                          {t('auth.login_page.login')}
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-0">
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('auth.login_page.email')}</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder={t('auth.login_page.email_placeholder')}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('auth.login_page.password')}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder={t('auth.login_page.password_placeholder')}
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('auth.login_page.creating_account')}
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          {t('auth.login_page.create_account')}
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>
                {t('auth.login_page.terms_accept')}{' '}
                <Link to="/terminos" className="text-primary hover:underline">
                  {t('auth.login_page.terms_of_service')}
                </Link>{' '}
                {t('auth.login_page.and')}{' '}
                <Link to="/privacidad" className="text-primary hover:underline">
                  {t('auth.login_page.privacy_policy')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}