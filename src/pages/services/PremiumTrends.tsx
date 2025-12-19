import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  Download, 
  Crown, 
  CheckCircle, 
  BarChart3, 
  Calendar,
  Globe,
  Star,
  Lock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { mockData, mockAuth } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

interface Subscription {
  id: string;
  status: string;
  expires_at: string;
  subscription_type: string;
}

const PremiumTrends = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('premium_subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('subscription_type', 'market_trends_premium')
        .eq('status', 'active')
        .single();

      if (!error && data) {
        setSubscription(data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe to Premium Market Trends",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create a subscription record
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      const { error } = await supabase
        .from('premium_subscriptions')
        .insert({
          user_id: user.id,
          subscription_type: 'market_trends_premium',
          price_usd: 29.00,
          billing_cycle: 'monthly',
          expires_at: expiresAt.toISOString(),
          status: 'pending'
        });

      if (error) throw error;

      // In a real implementation, this would redirect to Stripe Checkout
      toast({
        title: "Subscription Initiated",
        description: "Redirecting to secure payment page...",
      });

      // Simulate payment processing
      setTimeout(() => {
        window.open('https://stripe.com', '_blank');
      }, 1000);

    } catch (error) {
      console.error('Error creating subscription:', error);
      toast({
        title: "Error",
        description: "Failed to initiate subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadSample = () => {
    // Simulate sample report download
    const sampleContent = `
ADOMINIOZ MARKET TRENDS REPORT - SAMPLE
Generated: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY:
Digital asset marketplace trends for Q4 2024

KEY METRICS:
- Domain sales: +15% MoM
- Website valuations: $50K avg
- App marketplace: +22% growth
- FBA businesses: $125K avg sale price

SECTOR ANALYSIS:
1. Premium Domains
   - .com domains leading at 65% of sales
   - Brandable names: +35% premium
   
2. E-commerce Websites
   - Shopify stores dominating
   - Average revenue multiple: 3.2x

3. Mobile Applications
   - iOS apps: Higher valuations
   - Gaming apps: Premium segment

This is a sample report. Premium subscribers receive:
- Weekly detailed analysis
- Proprietary market data
- Investment recommendations
- Deal flow insights
- Exit strategy guidance

Subscribe to Premium Market Trends for complete reports.
    `;

    const blob = new Blob([sampleContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ADOMINIOZ_Market_Trends_Sample.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Sample Downloaded",
      description: "Check your downloads folder for the sample report"
    });
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">Premium Market Trends</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-6">
              Exclusive insights and analytics for serious digital asset investors
            </p>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Star className="h-4 w-4 mr-2" />
              $29/month USD
            </Badge>
          </div>

          {/* Subscription Status */}
          {subscription && (
            <Alert className="mb-8 border-success bg-success/10">
              <CheckCircle className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">
                You have an active Premium subscription until {new Date(subscription.expires_at).toLocaleDateString()}
              </AlertDescription>
            </Alert>
          )}

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Weekly Analytics Reports
                </CardTitle>
                <CardDescription>
                  Comprehensive market analysis with proprietary data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Sales volume trends by category</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Average valuation multiples</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Emerging market opportunities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Risk assessment matrices</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Investment Recommendations
                </CardTitle>
                <CardDescription>
                  Curated opportunities with detailed analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>High-potential asset identification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Valuation range estimates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Exit strategy recommendations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Portfolio diversification advice</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Market Intelligence
                </CardTitle>
                <CardDescription>
                  Insider knowledge and industry insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Regulatory impact analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Technology trend forecasting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Competitor movement tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Market sentiment indicators</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Exclusive Access
                </CardTitle>
                <CardDescription>
                  Premium benefits and early opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Pre-market listing notifications</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Private deal access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Expert webinar invitations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Direct broker consultations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sample Report Section */}
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Try Before You Subscribe
              </CardTitle>
              <CardDescription>
                Download a sample report to see the quality and depth of our analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-2">Sample Market Trends Report</h3>
                  <p className="text-sm text-muted-foreground">
                    Includes key metrics, sector analysis, and sample recommendations
                  </p>
                </div>
                <Button variant="outline" onClick={downloadSample}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Sample
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Subscription CTA */}
          {!subscription && (
            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="max-w-md mx-auto">
                  <h3 className="text-2xl font-bold mb-4">Start Your Premium Subscription</h3>
                  <p className="text-muted-foreground mb-6">
                    Join hundreds of successful investors who rely on our market intelligence
                  </p>
                  <div className="space-y-4">
                    <div className="text-3xl font-bold text-primary">$29<span className="text-lg text-muted-foreground">/month</span></div>
                    <Button 
                      size="lg" 
                      className="w-full btn-primary"
                      onClick={handleSubscribe}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processing...' : 'Subscribe Now'}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Cancel anytime. No long-term commitments.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Premium Content Preview (for subscribers) */}
          {subscription && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Latest Premium Report
                </CardTitle>
                <CardDescription>
                  Your exclusive market insights for this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Key Highlights</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Domain market up 15% this quarter</li>
                      <li>• SaaS valuations reaching new highs</li>
                      <li>• Mobile app market consolidation</li>
                      <li>• E-commerce multiple expansion</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">This Week's Opportunity</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm font-medium text-primary">Premium AI Tools Sector</p>
                      <p className="text-sm text-muted-foreground">
                        Undervalued opportunities in the AI tooling space with 3-5x potential returns
                      </p>
                    </div>
                  </div>
                </div>
                <Button className="mt-4 w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Full Report
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PremiumTrends;