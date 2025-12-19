import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Store, 
  User, 
  Building, 
  CreditCard, 
  Shield, 
  CheckCircle,
  Upload,
  Bitcoin,
  Wallet
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const RegisterSeller = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Datos personales
    fullName: "",
    email: "",
    phone: "",
    country: "",
    // Datos del negocio
    businessName: "",
    businessType: "",
    taxId: "",
    businessDescription: "",
    website: "",
    // Verificación
    idDocument: null,
    businessLicense: null,
    taxDocuments: null,
    // Métodos de pago
    paymentMethods: [],
    cryptoWallet: "",
    bankAccount: ""
  })
  const { toast } = useToast()

  const businessTypes = [
    "Empresa Individual", 
    "SL/LLC", 
    "SA/Corp", 
    "Autónomo/Freelancer",
    "Cooperativa",
    "Fundación/ONG"
  ]

  const paymentOptions = [
    { id: "stripe", name: "Stripe", icon: CreditCard },
    { id: "paypal", name: "PayPal", icon: CreditCard },
    { id: "bitcoin", name: "Bitcoin", icon: Bitcoin },
    { id: "ethereum", name: "Ethereum", icon: Wallet },
    { id: "usdt", name: "USDT", icon: Wallet },
    { id: "bank", name: "Transferencia Bancaria", icon: Building }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Registro enviado",
      description: "Tu solicitud está siendo revisada. Te contactaremos en 24-48h.",
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="businessName">Nombre del Negocio *</Label>
          <Input
            id="businessName"
            value={formData.businessName}
            onChange={(e) => setFormData({...formData, businessName: e.target.value})}
            placeholder="Nombre de tu empresa"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="businessType">Tipo de Negocio *</Label>
          <Select onValueChange={(value) => setFormData({...formData, businessType: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de empresa" />
            </SelectTrigger>
            <SelectContent>
              {businessTypes.map(type => (
                <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="taxId">NIF/CIF/Tax ID *</Label>
          <Input
            id="taxId"
            value={formData.taxId}
            onChange={(e) => setFormData({...formData, taxId: e.target.value})}
            placeholder="12345678A"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Sitio Web (opcional)</Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => setFormData({...formData, website: e.target.value})}
            placeholder="https://tuempresa.com"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="businessDescription">Descripción del Negocio *</Label>
        <Textarea
          id="businessDescription"
          value={formData.businessDescription}
          onChange={(e) => setFormData({...formData, businessDescription: e.target.value})}
          placeholder="Describe tu negocio, experiencia y tipos de activos digitales que vendes..."
          rows={4}
          required
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Verificación de Identidad</h3>
        <p className="text-muted-foreground">Sube los documentos requeridos para verificar tu identidad</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Documento de Identidad
            </CardTitle>
            <CardDescription>DNI, Pasaporte o Licencia de conducir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Arrastra tu documento o haz clic para subir</p>
              <Button variant="outline" className="mt-4">Seleccionar archivo</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Licencia de Negocio
            </CardTitle>
            <CardDescription>Registro mercantil o licencia comercial</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Arrastra tu licencia o haz clic para subir</p>
              <Button variant="outline" className="mt-4">Seleccionar archivo</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Métodos de Pago y Cobro</h3>
        <p className="text-muted-foreground">Configura cómo quieres recibir los pagos</p>
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

      {formData.paymentMethods.includes("bitcoin") && (
        <div className="space-y-2">
          <Label htmlFor="cryptoWallet">Dirección de Wallet Cripto</Label>
          <Input
            id="cryptoWallet"
            value={formData.cryptoWallet}
            onChange={(e) => setFormData({...formData, cryptoWallet: e.target.value})}
            placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
          />
        </div>
      )}

      {formData.paymentMethods.includes("bank") && (
        <div className="space-y-2">
          <Label htmlFor="bankAccount">IBAN Cuenta Bancaria</Label>
          <Input
            id="bankAccount"
            value={formData.bankAccount}
            onChange={(e) => setFormData({...formData, bankAccount: e.target.value})}
            placeholder="123456789 (Routing) / 123456789012 (Account)"
          />
        </div>
      )}
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <Store className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Registro de Vendedor</h1>
        <p className="text-muted-foreground">
          Únete a ADOMINIOZ como vendedor verificado de activos digitales
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
            {currentStep === 2 && "Datos del Negocio"}
            {currentStep === 3 && "Verificación"}
            {currentStep === 4 && "Métodos de Pago"}
          </CardTitle>
          <CardDescription>
            Paso {currentStep} de 4 - Completa toda la información requerida
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
                <Button type="submit" className="bg-gradient-to-r from-primary to-primary/80">
                  Enviar Solicitud
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Requirements Info */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Requisitos para Vendedores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">✓ Documentación Requerida:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Documento de identidad válido</li>
                <li>• Licencia de negocio o registro mercantil</li>
                <li>• Comprobante de domicilio fiscal</li>
                <li>• Referencias comerciales (opcional)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">✓ Comisiones y Tarifas:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 5% comisión por venta exitosa</li>
                <li>• Pagos instantáneos en cripto</li>
                <li>• Transferencias en 24-48h</li>
                <li>• Sin costes de listado</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterSeller