import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp, ArrowUp, Crown, Globe, Smartphone, Code, Package, Eye, DollarSign, Lock, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Trends = () => {
  const navigate = useNavigate();

  const trendingCategories = [
    {
      category: "AI Domains",
      icon: Globe,
      change: "+245%",
      trend: "up",
      avgPrice: "$2,650 USD",
      description: "AI-related domains in high demand"
    },
    {
      category: "Health Apps",
      icon: Smartphone,
      change: "+156%",
      trend: "up",
      avgPrice: "$9,800 USD",
      description: "Wellness and fitness applications"
    },
    {
      category: "B2B SaaS",
      icon: Code,
      change: "+89%",
      trend: "up",
      avgPrice: "$48,500 USD",
      description: "Business software as a service"
    },
    {
      category: "Eco Stores",
      icon: Package,
      change: "+67%",
      trend: "up",
      avgPrice: "$13,750 USD",
      description: "Sustainable e-commerce and eco products"
    }
  ]

  const marketInsights = [
    {
      title: "Premium Domain Market Growth",
      trend: "+34%",
      period: "Last quarter",
      description: "Single-word domains experiencing exceptional growth, especially in tech sectors."
    },
    {
      title: "Freemium Mobile Apps",
      trend: "+78%",
      period: "This year",
      description: "Freemium model continues to dominate, with better conversion rates in productivity apps."
    },
    {
      title: "AI-Integrated SaaS",
      trend: "+156%",
      period: "6 months",
      description: "SaaS tools incorporating artificial intelligence are being valued 3x higher."
    }
  ]

  const hotKeywords = [
    { keyword: "AI", volume: "12.3M", competition: "High", cpc: "$4.85 USD" },
    { keyword: "Crypto", volume: "8.7M", competition: "Medium", cpc: "$3.45 USD" },
    { keyword: "Sustainable", volume: "6.2M", competition: "Medium", cpc: "$3.10 USD" },
    { keyword: "Remote", volume: "5.8M", competition: "High", cpc: "$3.90 USD" },
    { keyword: "Health", volume: "4.9M", competition: "High", cpc: "$4.55 USD" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tight">
            Market Trends & Analysis
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Stay up to date with the latest digital asset market trends and make informed decisions
          </p>
          <Badge className="bg-gradient-to-r from-primary to-secondary text-lg px-6 py-2">
            <TrendingUp className="w-5 h-5 mr-2" />
            Updated in real time
          </Badge>
        </div>

        {/* Premium Alert */}
        <Alert className="mb-12 max-w-4xl mx-auto border-primary/20 bg-primary/5">
          <Crown className="h-4 w-4 text-primary" />
          <AlertDescription className="flex items-center justify-between">
            <span>Get exclusive weekly analysis and investment recommendations with our Premium subscription.</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/services/premium-trends')}
              className="ml-4"
            >
              <Star className="h-4 w-4 mr-2" />
              View Premium
            </Button>
          </AlertDescription>
        </Alert>

        {/* Trending Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-black text-foreground mb-8">Trending Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingCategories.map((item) => (
              <Card key={item.category} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex items-center gap-1 text-success">
                      <ArrowUp className="w-4 h-4" />
                      <span className="font-bold text-sm">{item.change}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {item.category}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  <div className="text-lg font-bold text-primary">{item.avgPrice}</div>
                  <div className="text-xs text-muted-foreground">Average price</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Market Insights */}
        <section className="mb-16 py-16 bg-muted/30 rounded-3xl">
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="text-3xl font-black text-foreground mb-8 text-center">Market Insights</h2>
            <div className="space-y-6">
              {marketInsights.map((insight, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2">{insight.title}</h3>
                        <p className="text-muted-foreground mb-3">{insight.description}</p>
                        <Badge variant="outline" className="text-muted-foreground">
                          {insight.period}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-success mb-2">
                          <TrendingUp className="w-5 h-5" />
                          <span className="text-2xl font-bold">{insight.trend}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">Growth</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Hot Keywords */}
        <section className="mb-16">
          <h2 className="text-3xl font-black text-foreground mb-8">Hot Keywords</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Highest Demand Keywords
              </CardTitle>
              <CardDescription>
                Most searched terms in the digital asset market
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hotKeywords.map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-bold text-foreground">#{keyword.keyword}</div>
                        <div className="text-sm text-muted-foreground">
                          Competition: {keyword.competition}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-foreground flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {keyword.volume}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {keyword.cpc} CPC
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Premium Content Preview */}
        <section className="mb-16">
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Lock className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Premium Market Analysis</CardTitle>
              </div>
              <CardDescription className="text-lg">
                Get exclusive weekly insights, investment recommendations, and detailed market analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">What's Included:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-primary" />
                      Weekly detailed market reports
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Investment opportunity alerts
                    </li>
                    <li className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      Valuation trend analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-primary" />
                      Early access to premium listings
                    </li>
                  </ul>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">$29/month</div>
                  <p className="text-muted-foreground mb-4">Cancel anytime</p>
                  <div className="space-y-2">
                    <Button 
                      className="w-full btn-primary"
                      onClick={() => navigate('/services/premium-trends')}
                    >
                      Subscribe Now
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/services/premium-trends')}
                    >
                      View Free Sample
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default Trends