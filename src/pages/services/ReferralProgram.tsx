import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ReferralDashboard from '@/components/ReferralDashboard';
import { 
  Users, 
  DollarSign, 
  Gift, 
  TrendingUp, 
  Share2, 
  CheckCircle, 
  Copy,
  Trophy,
  Star,
  Crown,
  Zap
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const ReferralProgram = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referralCode] = useState("ADM-REF-" + Math.random().toString(36).substr(2, 6).toUpperCase());

  const referralTiers = [
    {
      tier: "Bronze",
      icon: Trophy,
      referrals: "1-10",
      commission: "3%",
      bonuses: ["$50 signup bonus", "Monthly reports"],
      color: "text-orange-600"
    },
    {
      tier: "Silver", 
      icon: Star,
      referrals: "11-25",
      commission: "5%",
      bonuses: ["$100 signup bonus", "Priority support", "Exclusive webinars"],
      color: "text-gray-600"
    },
    {
      tier: "Gold",
      icon: Crown,
      referrals: "26-50",
      commission: "7%",
      bonuses: ["$250 signup bonus", "Direct broker access", "Premium analytics"],
      color: "text-yellow-600"
    },
    {
      tier: "Platinum",
      icon: Zap,
      referrals: "50+",
      commission: "10%",
      bonuses: ["$500 signup bonus", "VIP treatment", "Co-marketing opportunities"],
      color: "text-purple-600"
    }
  ];

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Código copiado",
      description: "Tu código de referido ha sido copiado al portapapeles"
    });
  };

  const shareOnSocial = (platform: string) => {
    const message = `¡Únete a ADOMINIOZ y gana dinero con el programa de referidos! Usa mi código: ${referralCode}`;
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
      linkedin: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://adominioz.com')}&summary=${encodeURIComponent(message)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`
    };
    
    window.open(urls[platform as keyof typeof urls], '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tight">
            Programa de Referidos
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Gana hasta 10% de comisión por cada venta referida. Cuantos más referidos traigas, mayor será tu comisión.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="bg-gradient-to-r from-primary to-secondary text-lg px-6 py-2">
              <Gift className="w-5 h-5 mr-2" />
              Hasta 10% Comisión
            </Badge>
            <Badge variant="outline" className="text-lg px-6 py-2">
              <DollarSign className="w-5 h-5 mr-2" />
              Pagos Mensuales
            </Badge>
          </div>
        </div>

        {/* Referral Code Section */}
        {user && (
          <Card className="mb-16 max-w-2xl mx-auto border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Tu Código de Referido
              </CardTitle>
              <CardDescription>
                Comparte este código y empieza a ganar comisiones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input value={referralCode} readOnly className="font-mono text-lg" />
                <Button onClick={copyReferralCode} variant="outline">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm" onClick={() => shareOnSocial('twitter')}>
                  Compartir en Twitter
                </Button>
                <Button variant="outline" size="sm" onClick={() => shareOnSocial('linkedin')}>
                  Compartir en LinkedIn
                </Button>
                <Button variant="outline" size="sm" onClick={() => shareOnSocial('whatsapp')}>
                  Compartir en WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Login Alert for non-users */}
        {!user && (
          <Alert className="mb-16 max-w-2xl mx-auto border-primary/20">
            <Users className="h-4 w-4" />
            <AlertDescription>
              <strong>Inicia sesión</strong> para obtener tu código de referido personalizado y comenzar a ganar comisiones.
            </AlertDescription>
          </Alert>
        )}

        {/* Referral Tiers */}
        <section className="mb-16">
          <h2 className="text-3xl font-black text-foreground mb-8 text-center">Niveles de Comisión</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {referralTiers.map((tier) => (
              <Card key={tier.tier} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <tier.icon className={`w-8 h-8 ${tier.color}`} />
                  </div>
                  <CardTitle className="text-xl">{tier.tier}</CardTitle>
                  <div className="text-3xl font-bold text-primary">{tier.commission}</div>
                  <div className="text-sm text-muted-foreground">{tier.referrals} referidos</div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tier.bonuses.map((bonus, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{bonus}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Existing Dashboard Component */}
        <section className="mb-16">
          <h2 className="text-3xl font-black text-foreground mb-8 text-center">Tu Panel de Referidos</h2>
          <ReferralDashboard />
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-black text-foreground mb-8 text-center">Cómo Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Regístrate</h3>
              <p className="text-muted-foreground">Crea tu cuenta y obtén tu código único de referido</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Comparte</h3>
              <p className="text-muted-foreground">Comparte tu código en redes sociales o con contactos</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Gana</h3>
              <p className="text-muted-foreground">Recibe comisión por cada venta que generes</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">4. Cobra</h3>
              <p className="text-muted-foreground">Retira tus ganancias mensualmente</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReferralProgram;