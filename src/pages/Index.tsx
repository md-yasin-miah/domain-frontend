import { Link } from "react-router-dom";
import { Shield, CheckCircle, DollarSign, Globe, Monitor, Smartphone, ShoppingBag, ArrowRight, TrendingUp, Users, Award, Wallet, Zap, FileText, UserCheck, CreditCard, Bitcoin, Gem, Play, Database, Code } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { AdminQuickAccess } from "@/components/AdminQuickAccess";
import { FlipWords } from "@/components/ui/flip-words";

const Index = () => {
  const { t } = useTranslation();

  // Dynamic words for FlipWords animation
  const dynamicWords = t('hero.title').includes('futuro')
    ? ['futuro', 'presente', 'poder', 'éxito']
    : ['future', 'present', 'power', 'success'];
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      {/* Hero Banner - Futuristic Commerce */}
      <section className="relative min-h-screen py-16 flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/lovable-uploads/9851ebbe-e0c7-4f47-85b7-5a275776e711.png"
            alt="El futuro del comercio digital"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50"></div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="animate-fade-in">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-roboto font-black text-white mb-8 tracking-tight leading-none">
              {t('hero.title').includes('futuro') ? (
                <>
                  El <FlipWords words={dynamicWords} className="text-primary" /> del comercio digital
                </>
              ) : (
                <>
                  The <FlipWords words={dynamicWords} className="text-primary" /> of digital commerce
                </>
              )}
            </h1>
            <p className="text-xl md:text-3xl text-white/90 mb-8 font-roboto max-w-4xl mx-auto leading-relaxed font-light">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link to="/auth" className="btn-primary flex items-center space-x-3 text-xl px-12 py-4 shadow-2xl hover:shadow-primary/25">
                <Wallet className="w-6 h-6" />
                <span>{t('hero.cta_start')}</span>
              </Link>
              <Link to="/marketplace" className="glass border-white/30 text-white hover:bg-white/20 flex items-center space-x-3 text-xl px-12 py-4 rounded-xl font-medium transition-all duration-300">
                <TrendingUp className="w-6 h-6" />
                <span>{t('hero.cta_explore')}</span>
              </Link>
            </div>

            {/* Stats Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              <div className="text-center animate-scale-in">
                <div className="text-3xl md:text-4xl font-roboto font-black text-white mb-2">$2.4M</div>
                <div className="text-white/80 font-roboto text-sm">{t('stats.transactions')}</div>
              </div>
              <div className="text-center animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <div className="text-3xl md:text-4xl font-roboto font-black text-white mb-2">15K+</div>
                <div className="text-white/80 font-roboto text-sm">{t('stats.users')}</div>
              </div>
              <div className="text-center animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <div className="text-3xl md:text-4xl font-roboto font-black text-white mb-2">2,247</div>
                <div className="text-white/80 font-roboto text-sm">{t('stats.assets')}</div>
              </div>
              <div className="text-center animate-scale-in" style={{ animationDelay: '0.3s' }}>
                <div className="text-3xl md:text-4xl font-roboto font-black text-white mb-2">98%</div>
                <div className="text-white/80 font-roboto text-sm">{t('stats.satisfaction')}</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-8 mt-12 text-white/80">
              <div className="flex items-center space-x-2">
                <Bitcoin className="w-6 h-6 text-primary" />
                <span className="font-roboto">{t('payment_badges.bitcoin')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="w-6 h-6 text-primary" />
                <span className="font-roboto">{t('payment_badges.cards')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-primary" />
                <span className="font-roboto">{t('payment_badges.escrow')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up">
            <div className="card-professional text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-roboto font-bold mb-3">{t('trust.security')}</h3>
              <p className="text-muted-foreground font-roboto">{t('trust.security_desc')}</p>
            </div>
            <div className="card-professional text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-roboto font-bold mb-3">{t('trust.verified')}</h3>
              <p className="text-muted-foreground font-roboto">{t('trust.verified_desc')}</p>
            </div>
            <div className="card-professional text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-roboto font-bold mb-3">{t('trust.support')}</h3>
              <p className="text-muted-foreground font-roboto">{t('trust.support_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Professional Layout */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-roboto font-black text-foreground mb-6">
              {t('categories.title')}
            </h2>
            <p className="text-xl text-muted-foreground font-roboto max-w-3xl mx-auto">
              {t('categories.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-slide-up">
            <Link to="/marketplace/dominios" className="card-professional group cursor-pointer hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-roboto font-bold mb-4 group-hover:text-primary transition-colors">
                {t('categories.domains')}
              </h3>
              <p className="text-muted-foreground font-roboto mb-6 leading-relaxed text-sm">
                {t('categories.domains_desc')}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">{t('common.from')} $299+</span>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>

            <Link to="/marketplace/sitios" className="card-professional group cursor-pointer hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Monitor className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-roboto font-bold mb-4 group-hover:text-primary transition-colors">
                {t('categories.websites')}
              </h3>
              <p className="text-muted-foreground font-roboto mb-6 leading-relaxed text-sm">
                Webs con ingresos recurrentes y analytics verificados.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">$1,499+</span>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>

            <Link to="/marketplace" className="card-professional group cursor-pointer hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Database className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-roboto font-bold mb-4 group-hover:text-primary transition-colors">
                Servidores y Hostings
              </h3>
              <p className="text-muted-foreground font-roboto mb-6 leading-relaxed text-sm">
                Infraestructura web completa con clientes y facturación recurrente.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">$599+</span>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>

            <Link to="/marketplace" className="card-professional group cursor-pointer hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-roboto font-bold mb-4 group-hover:text-primary transition-colors">
                Ecommerce
              </h3>
              <p className="text-muted-foreground font-roboto mb-6 leading-relaxed text-sm">
                Tiendas completas con inventario y sistemas establecidos.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">$4,999+</span>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>

            <Link to="/marketplace" className="card-professional group cursor-pointer hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Smartphone className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-roboto font-bold mb-4 group-hover:text-primary transition-colors">
                {t('categories.mobile_apps')}
              </h3>
              <p className="text-muted-foreground font-roboto mb-6 leading-relaxed text-sm">
                {t('categories.mobile_apps_desc')}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">$2,999+</span>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>

            <Link to="/marketplace" className="card-professional group cursor-pointer hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Play className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-roboto font-bold mb-4 group-hover:text-primary transition-colors">
                Canales Digitales
              </h3>
              <p className="text-muted-foreground font-roboto mb-6 leading-relaxed text-sm">
                YouTube, TikTok y redes sociales con audiencia establecida.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">$799+</span>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>

            <Link to="/marketplace" className="card-professional group cursor-pointer hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Code className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-roboto font-bold mb-4 group-hover:text-primary transition-colors">
                Software/SaaS
              </h3>
              <p className="text-muted-foreground font-roboto mb-6 leading-relaxed text-sm">
                Aplicaciones web con suscriptores y código fuente completo.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">$9,999+</span>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>

            <Link to="/marketplace" className="card-professional group cursor-pointer hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Database className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-roboto font-bold mb-4 group-hover:text-primary transition-colors">
                {t('categories.databases')}
              </h3>
              <p className="text-muted-foreground font-roboto mb-6 leading-relaxed text-sm">
                {t('categories.databases_desc')}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">{t('common.from')} $199+</span>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-roboto font-black text-foreground mb-6">
              {t('how_it_works.title')}
            </h2>
            <p className="text-xl text-muted-foreground font-roboto max-w-3xl mx-auto">
              {t('how_it_works.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <UserCheck className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-roboto font-bold mb-4">{t('how_it_works.verification')}</h3>
              <p className="text-muted-foreground font-roboto">
                {t('how_it_works.verification_desc')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-roboto font-bold mb-4">{t('how_it_works.escrow')}</h3>
              <p className="text-muted-foreground font-roboto">
                {t('how_it_works.escrow_desc')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-roboto font-bold mb-4">{t('how_it_works.transfer')}</h3>
              <p className="text-muted-foreground font-roboto">
                {t('how_it_works.transfer_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-roboto font-black text-foreground mb-6">
              {t('requirements.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Para Compradores */}
            <div className="card-professional">
              <h3 className="text-3xl font-roboto font-bold mb-8 text-primary">{t('requirements.buyers')}</h3>
              <ul className="space-y-4 font-roboto">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1" />
                  <span>{t('requirements.buyers_reqs.0')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1" />
                  <span>{t('requirements.buyers_reqs.1')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1" />
                  <span>{t('requirements.buyers_reqs.2')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1" />
                  <span>{t('requirements.buyers_reqs.3')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1" />
                  <span>{t('requirements.buyers_reqs.4')}</span>
                </li>
              </ul>
            </div>

            {/* Para Vendedores */}
            <div className="card-professional">
              <h3 className="text-3xl font-roboto font-bold mb-8 text-primary">{t('requirements.sellers')}</h3>
              <ul className="space-y-4 font-roboto">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1" />
                  <span>{t('requirements.sellers_reqs.0')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1" />
                  <span>{t('requirements.sellers_reqs.1')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1" />
                  <span>{t('requirements.sellers_reqs.2')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1" />
                  <span>{t('requirements.sellers_reqs.3')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1" />
                  <span>{t('requirements.sellers_reqs.4')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-roboto font-black text-foreground mb-6">
            {t('payments.title')}
          </h2>
          <p className="text-xl text-muted-foreground font-roboto max-w-3xl mx-auto mb-16">
            {t('payments.subtitle')}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="card-professional text-center">
              <Bitcoin className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="font-roboto font-bold">{t('payments.bitcoin')}</h4>
              <p className="text-sm text-muted-foreground font-roboto">BTC</p>
            </div>
            <div className="card-professional text-center">
              <Gem className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="font-roboto font-bold">{t('payments.ethereum')}</h4>
              <p className="text-sm text-muted-foreground font-roboto">ETH</p>
            </div>
            <div className="card-professional text-center">
              <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="font-roboto font-bold">{t('payments.usdt')}</h4>
              <p className="text-sm text-muted-foreground font-roboto">Tether</p>
            </div>
            <div className="card-professional text-center">
              <CreditCard className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="font-roboto font-bold">{t('payments.cards')}</h4>
              <p className="text-sm text-muted-foreground font-roboto">Visa/MC</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card-professional animate-scale-in">
            <h2 className="text-4xl md:text-5xl font-roboto font-black text-foreground mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-muted-foreground mb-10 font-roboto">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="btn-primary text-lg flex items-center space-x-3">
                <Wallet className="w-5 h-5" />
                <span>{t('cta.register')}</span>
              </button>
              <button className="btn-secondary text-lg flex items-center space-x-3">
                <Play className="w-5 h-5" />
                <span>{t('cta.demo')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-4xl font-roboto font-black text-primary mb-2">2,247</div>
              <div className="text-muted-foreground font-roboto">{t('stats_section.verified_assets')}</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-roboto font-black text-primary mb-2">$2.4M</div>
              <div className="text-muted-foreground font-roboto">{t('stats_section.in_transactions')}</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-roboto font-black text-primary mb-2">15,432</div>
              <div className="text-muted-foreground font-roboto">{t('stats_section.registered_users')}</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-roboto font-black text-primary mb-2">98%</div>
              <div className="text-muted-foreground font-roboto">{t('stats_section.satisfaction')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with Legal */}
      <footer className="bg-muted/50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img
                  src="/lovable-uploads/c4e923e1-17e4-42b9-90b4-d79eed7fcc19.png"
                  alt="ADOMINIOZ"
                  className="h-12 w-auto"
                />
              </div>
              <p className="text-muted-foreground font-roboto leading-relaxed mb-6">
                {t('footer.description')}
              </p>
              <div className="flex space-x-4">
                <Bitcoin className="w-6 h-6 text-primary" />
                <Shield className="w-6 h-6 text-primary" />
                <Zap className="w-6 h-6 text-primary" />
              </div>
            </div>

            <div>
              <h4 className="font-roboto font-bold mb-6 text-foreground">{t('footer.legal')}</h4>
              <ul className="space-y-3 font-roboto">
                <li><a href="/terminos" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.terms')}</a></li>
                <li><a href="/privacidad" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.privacy')}</a></li>
                <li><a href="/cookies" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.cookies')}</a></li>
                <li><a href="/legal" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.legal_notice')}</a></li>
                <li><a href="/aml" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.aml')}</a></li>
                <li><a href="/proteccion-datos" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.data_protection')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-roboto font-bold mb-6 text-foreground">{t('footer.support')}</h4>
              <ul className="space-y-3 font-roboto">
                <li><a href="/ayuda" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.help')}</a></li>
                <li><a href="/contacto" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.contact')}</a></li>
                <li><a href="/verificacion" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.verification')}</a></li>
                <li><a href="/escrow" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.escrow')}</a></li>
                <li><a href="/disputas" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.disputes')}</a></li>
                <li><a href="/tarifas" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.fees')}</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div>
                <p className="text-muted-foreground font-roboto text-sm mb-2">
                  {t('footer.copyright')}
                </p>
                <p className="text-muted-foreground font-roboto text-xs">
                  {t('footer.registry')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground font-roboto text-xs mb-2">
                  {t('footer.regulated')}
                </p>
                <p className="text-muted-foreground font-roboto text-xs">
                  {t('footer.license')}
                </p>
              </div>
            </div>
            <div className="text-center pt-4 border-t border-border">
              <p className="text-muted-foreground font-roboto text-xs">
                {t('footer.disclaimer')}
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Admin Quick Access - Solo visible para configuración */}
      <AdminQuickAccess />
    </div>
  );
};

export default Index;