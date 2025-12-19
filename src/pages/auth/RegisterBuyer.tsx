import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  ShoppingCart, 
  User, 
  CreditCard, 
  Shield, 
  CheckCircle,
  Bitcoin,
  Wallet,
  Building,
  Star,
  Users
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const RegisterBuyer = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Datos personales
    fullName: "",
    email: "",
    phone: "",
    country: "",
    // Intereses
    interests: [],
    budget: "",
    // Métodos de pago
    paymentMethods: [],
    cryptoWallet: "",
    // Verificación
    agreeToTerms: false,
    agreeToKYC: false
  })
  const { toast } = useToast()

  const interestOptions = [
    "Dominios Premium",
    "Sitios Web Establecidos", 
    "Apps Móviles",
    "Tiendas E-commerce",
    "NFTs y Coleccionables",
    "Canales de Redes Sociales",
    "Software/SaaS",
    "Bases de Datos"
  ]

  const budgetRanges = [
    "$500 - $2,000",
    "$2,000 - $10,000",
    "€10,000 - €50,000",
    "€50,000 - €250,000",
    "€250,000+"
  ]

  const paymentOptions = [
    { id: "stripe", name: "Tarjeta de Crédito/Débito", icon: CreditCard },
    { id: "paypal", name: "PayPal", icon: CreditCard },
    { id: "bitcoin", name: "Bitcoin", icon: Bitcoin },
    { id: "ethereum", name: "Ethereum", icon: Wallet },
    { id: "usdt", name: "USDT/Stablecoins", icon: Wallet },
    { id: "bank", name: "Transferencia Bancaria", icon: Building }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Registro completado",
      description: "¡Bienvenido a ADOMINIOZ! Ya puedes empezar a explorar activos digitales.",
    })
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nombre Completo *</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            placeholder="Tu nombre completo"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="tu@email.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="+34 600 000 000"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">País *</Label>
          <Select onValueChange={(value) => setFormData({...formData, country: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona tu país" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usa">Estados Unidos</SelectItem>
              <SelectItem value="mexico">México</SelectItem>
              <SelectItem value="argentina">Argentina</SelectItem>
              <SelectItem value="colombia">Colombia</SelectItem>
              <SelectItem value="usa">Estados Unidos</SelectItem>
              <SelectItem value="other">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">¿Qué tipo de activos digitales te interesan?</Label>
        <p className="text-sm text-muted-foreground mb-4">Selecciona todas las opciones que apliquen</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {interestOptions.map((interest) => (
            <Card key={interest} className="cursor-pointer hover:border-primary transition-colors">
              <CardContent className="p-4 flex items-center space-x-3">
                <Checkbox 
                  id={interest}
                  checked={formData.interests.includes(interest)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData({
                        ...formData, 
                        interests: [...formData.interests, interest]
                      })
                    } else {
                      setFormData({
                        ...formData,
                        interests: formData.interests.filter(i => i !== interest)
                      })
                    }
                  }}
                />
                <Label htmlFor={interest} className="cursor-pointer text-sm">{interest}</Label>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget">Presupuesto Estimado</Label>
        <Select onValueChange={(value) => setFormData({...formData, budget: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona tu rango de presupuesto" />
          </SelectTrigger>
          <SelectContent>
            {budgetRanges.map(range => (
              <SelectItem key={range} value={range}>{range}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Métodos de Pago</h3>
        <p className="text-muted-foreground">Configura cómo quieres realizar tus compras</p>
      </div>

      <div className="space-y-4">
        <Label>Selecciona tus métodos de pago preferidos:</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentOptions.map((option) => {
            const Icon = option.icon
            return (
              <Card key={option.id} className="cursor-pointer hover:border-primary transition-colors">
                <CardContent className="p-4 flex items-center space-x-3">
                  <Checkbox 
                    id={option.id}
                    checked={formData.paymentMethods.includes(option.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData({
                          ...formData, 
                          paymentMethods: [...formData.paymentMethods, option.id]
                        })
                      } else {
                        setFormData({
                          ...formData,
                          paymentMethods: formData.paymentMethods.filter(m => m !== option.id)
                        })
                      }
                    }}
                  />
                  <Icon className="h-5 w-5 text-primary" />
                  <Label htmlFor={option.id} className="cursor-pointer">{option.name}</Label>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {(formData.paymentMethods.includes("bitcoin") || 
        formData.paymentMethods.includes("ethereum") || 
        formData.paymentMethods.includes("usdt")) && (
        <div className="space-y-2">
          <Label htmlFor="cryptoWallet">Dirección de Wallet Cripto (opcional)</Label>
          <Input
            id="cryptoWallet"
            value={formData.cryptoWallet}
            onChange={(e) => setFormData({...formData, cryptoWallet: e.target.value})}
            placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
          />
          <p className="text-xs text-muted-foreground">
            También puedes configurar esto más tarde en tu perfil
          </p>
        </div>
      )}

      <div className="bg-muted/30 p-4 rounded-lg">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          Pagos Seguros
        </h4>
        <p className="text-sm text-muted-foreground">
          Todos los pagos están protegidos por nuestro sistema de custodia (escrow). 
          Los fondos solo se liberan cuando confirmas que has recibido el activo digital.
        </p>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Términos y Verificación</h3>
        <p className="text-muted-foreground">Acepta nuestros términos para completar el registro</p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
                <Checkbox 
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => setFormData({...formData, agreeToTerms: !!checked})}
              />
              <div>
                <Label htmlFor="terms" className="cursor-pointer text-sm">
                  Acepto los <Button variant="link" className="p-0 h-auto">Términos y Condiciones</Button> y la{" "}
                  <Button variant="link" className="p-0 h-auto">Política de Privacidad</Button>
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
                <Checkbox 
                  id="kyc"
                  checked={formData.agreeToKYC}
                  onCheckedChange={(checked) => setFormData({...formData, agreeToKYC: !!checked})}
              />
              <div>
                <Label htmlFor="kyc" className="cursor-pointer text-sm">
                  Entiendo que para compras superiores a €10,000 se requerirá verificación de identidad{" "}
                  <Button variant="link" className="p-0 h-auto">(Política AML/KYC)</Button>
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-primary/5 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-5 h-5 text-primary" />
          <h4 className="font-medium">¡Estás a punto de unirte a ADOMINIOZ!</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <CheckCircle className="w-4 h-4 text-primary" />
              <div className="font-medium text-primary">Acceso Inmediato</div>
            </div>
            <div className="text-muted-foreground">Explora miles de activos digitales</div>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Shield className="w-4 h-4 text-primary" />
              <div className="font-medium text-primary">Compras Seguras</div>
            </div>
            <div className="text-muted-foreground">Sistema de custodia protegido</div>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Users className="w-4 h-4 text-primary" />
              <div className="font-medium text-primary">Soporte 24/7</div>
            </div>
            <div className="text-muted-foreground">Equipo de expertos disponible</div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <ShoppingCart className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Registro de Comprador</h1>
        <p className="text-muted-foreground">
          Únete a ADOMINIOZ y descubre los mejores activos digitales
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
              </div>
              {step < 4 && (
                <div className={`w-12 h-0.5 ${step < currentStep ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 1 && "Información Personal"}
            {currentStep === 2 && "Intereses y Presupuesto"}
            {currentStep === 3 && "Métodos de Pago"}
            {currentStep === 4 && "Términos y Condiciones"}
          </CardTitle>
          <CardDescription>
            Paso {currentStep} de 4 - Proceso rápido y sencillo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Anterior
              </Button>
              
              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                >
                  Siguiente
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-primary to-primary/80"
                  disabled={!formData.agreeToTerms || !formData.agreeToKYC}
                >
                  Crear Cuenta
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterBuyer