import { useState } from "react";
import { Search, MessageCircle, Phone, Mail, ChevronDown, ChevronRight, ArrowRight, HelpCircle, Book, Zap, Shield, DollarSign, Users, Settings, MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Link } from "react-router-dom";

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const categories = [
    {
      title: "Primeros Pasos",
      description: "Todo lo que necesitas para comenzar",
      icon: Book,
      color: "bg-primary/10 text-primary",
      articles: 12
    },
    {
      title: "Comprar y Vender",
      description: "Guías sobre transacciones seguras",
      icon: DollarSign,
      color: "bg-success/10 text-success", 
      articles: 18
    },
    {
      title: "Seguridad",
      description: "Protege tu cuenta y transacciones",
      icon: Shield,
      color: "bg-destructive/10 text-destructive",
      articles: 8
    },
    {
      title: "Verificación KYC",
      description: "Proceso de verificación de identidad",
      icon: Users,
      color: "bg-secondary/10 text-secondary",
      articles: 6
    },
    {
      title: "Pagos y Facturación",
      description: "Métodos de pago y facturación",
      icon: Zap,
      color: "bg-warning/10 text-warning",
      articles: 10
    },
    {
      title: "Configuración de Cuenta",
      description: "Personaliza tu experiencia",
      icon: Settings,
      color: "bg-primary/15 text-primary",
      articles: 9
    },
    {
      title: "Correo Electrónico",
      description: "Configura tus cuentas de correo",
      icon: MailIcon,
      color: "bg-blue-500/10 text-blue-500",
      articles: 15
    }
  ];

  const faqs = [
    {
      id: "1",
      question: "¿Cómo puedo verificar mi cuenta?",
      answer: "La verificación de cuenta es un proceso de 3 pasos: 1) Verificación de email, 2) Subida de documento de identidad, 3) Verificación de domicilio. El proceso toma entre 24-48 horas hábiles.",
      category: "Verificación"
    },
    {
      id: "2", 
      question: "¿Qué métodos de pago aceptan?",
      answer: "Aceptamos Bitcoin (BTC), Ethereum (ETH), Tether (USDT), tarjetas de crédito/débito Visa y Mastercard, y transferencias bancarias. Todos los pagos son procesados de forma segura.",
      category: "Pagos"
    },
    {
      id: "3",
      question: "¿Cómo funciona el sistema de escrow?",
      answer: "Nuestro sistema de escrow protege a compradores y vendedores. Los fondos se mantienen seguros hasta que se completa la transferencia del activo y ambas partes confirman la transacción.",
      category: "Seguridad"
    },
    {
      id: "4",
      question: "¿Cuánto tiempo toma transferir un dominio?",
      answer: "La transferencia de dominios generalmente toma entre 5-7 días hábiles, dependiendo del registrar actual. Nosotros gestionamos todo el proceso por ti.",
      category: "Dominios"
    },
    {
      id: "5",
      question: "¿Puedo cancelar una transacción?",
      answer: "Las transacciones pueden cancelarse antes de que se liberen los fondos del escrow. Una vez liberados los fondos, la transacción es final. Contacta al soporte para casos especiales.",
      category: "Transacciones"
    },
    {
      id: "6",
      question: "¿Cómo evalúan el valor de los activos?",
      answer: "Utilizamos múltiples métricas: tráfico web, ingresos históricos, métricas SEO, edad del dominio, tendencias de mercado y análisis comparativo. Nuestros expertos realizan evaluaciones detalladas.",
      category: "Valoración"
    },
    {
      id: "7",
      question: "¿Hay comisiones por vender?",
      answer: "Cobramos una comisión del 5% sobre el valor total de la transacción exitosa. No hay costos ocultos ni tarifas de listado.",
      category: "Comisiones"
    },
    {
      id: "8",
      question: "¿Ofrecen garantías post-compra?",
      answer: "Ofrecemos una garantía de 7 días para verificar que el activo cumple con las especificaciones prometidas. Si hay discrepancias importantes, facilitamos la resolución.",
      category: "Garantías"
    },
    // Email Configuration FAQs
    {
      id: "email-1",
      question: "¿Cómo configuro mi cuenta de correo en Outlook?",
      answer: "Para configurar tu correo en Outlook: 1) Abre Outlook y ve a Archivo > Agregar cuenta. 2) Ingresa tu dirección de correo. 3) Selecciona 'Configuración avanzada' y luego 'Configuración manual'. 4) Elige IMAP o POP3. 5) Ingresa los datos del servidor: IMAP: mail.tudominio.com puerto 993 (SSL), SMTP: mail.tudominio.com puerto 465 (SSL). 6) Usa tu correo completo como nombre de usuario y tu contraseña.",
      category: "Email"
    },
    {
      id: "email-2",
      question: "¿Cuáles son los servidores IMAP y SMTP para mi correo?",
      answer: "Los servidores de correo son: Servidor IMAP: mail.tudominio.com (Puerto 993 con SSL/TLS) | Servidor POP3: mail.tudominio.com (Puerto 995 con SSL/TLS) | Servidor SMTP: mail.tudominio.com (Puerto 465 con SSL o Puerto 587 con STARTTLS). Tu nombre de usuario es tu dirección de correo completa (usuario@tudominio.com).",
      category: "Email"
    },
    {
      id: "email-3",
      question: "¿Cómo configuro mi correo en Gmail (Android/iOS)?",
      answer: "En Gmail: 1) Abre la app de Gmail y ve a Configuración. 2) Toca 'Agregar cuenta' y selecciona 'Otra'. 3) Ingresa tu correo completo. 4) Selecciona tipo de cuenta (recomendamos IMAP). 5) Ingresa tu contraseña. 6) Configura servidor entrante: mail.tudominio.com puerto 993. 7) Configura servidor saliente (SMTP): mail.tudominio.com puerto 465. 8) Marca la casilla 'Requiere inicio de sesión' y usa las mismas credenciales.",
      category: "Email"
    },
    {
      id: "email-4",
      question: "¿Qué diferencia hay entre IMAP y POP3?",
      answer: "IMAP (recomendado): Sincroniza el correo en todos tus dispositivos. Los mensajes se mantienen en el servidor. Ideal si accedes desde múltiples dispositivos (PC, móvil, tablet). POP3: Descarga los mensajes a tu dispositivo y los elimina del servidor. Ideal si solo usas un dispositivo y quieres ahorrar espacio en el servidor. Recomendamos IMAP para mayor flexibilidad.",
      category: "Email"
    },
    {
      id: "email-5",
      question: "¿Cómo accedo a mi correo desde el navegador (Webmail)?",
      answer: "Puedes acceder a tu webmail desde: https://webmail.tudominio.com o https://mail.tudominio.com. Usa tu dirección de correo completa (usuario@tudominio.com) y tu contraseña para iniciar sesión. El webmail te permite leer, enviar y gestionar correos desde cualquier navegador sin necesidad de configurar un cliente de correo.",
      category: "Email"
    },
    {
      id: "email-6",
      question: "Mi correo no envía mensajes, ¿qué hago?",
      answer: "Verifica lo siguiente: 1) Revisa la configuración del servidor SMTP (mail.tudominio.com, puerto 465 con SSL o 587 con STARTTLS). 2) Asegúrate de que la opción 'Mi servidor requiere autenticación' esté activada. 3) Verifica que usas tu correo completo como usuario y la contraseña correcta. 4) Revisa que tu proveedor de internet no bloquee el puerto 465 o 587. 5) Desactiva temporalmente el antivirus/firewall para probar. Si el problema persiste, contacta a soporte.",
      category: "Email"
    },
    {
      id: "email-7",
      question: "¿Cómo configuro mi correo en Apple Mail (iPhone/Mac)?",
      answer: "En iPhone/iPad: 1) Ve a Ajustes > Correo > Cuentas > Añadir cuenta. 2) Selecciona 'Otra' > 'Añadir cuenta de correo'. 3) Ingresa tu nombre, correo, contraseña y descripción. 4) En la siguiente pantalla, configura: IMAP - Servidor entrante: mail.tudominio.com | Servidor saliente: mail.tudominio.com. 5) Activa SSL y ajusta los puertos (993 para IMAP, 465 para SMTP). En Mac: Proceso similar desde Preferencias del Sistema > Cuentas de Internet.",
      category: "Email"
    },
    {
      id: "email-8",
      question: "¿Por qué mis correos van a la carpeta de spam?",
      answer: "Esto puede ocurrir si: 1) El dominio remitente no tiene configurados correctamente los registros SPF, DKIM o DMARC. 2) El contenido del correo contiene palabras o enlaces sospechosos. 3) Envías muchos correos en poco tiempo. 4) Tu IP está en una lista negra. Soluciones: Verifica tus registros DNS, evita usar mayúsculas excesivas o muchos signos de exclamación, no envíes archivos .exe o .zip sospechosos. Contacta a soporte para revisar la configuración DNS.",
      category: "Email"
    },
    {
      id: "email-9",
      question: "¿Cuál es el límite de tamaño para archivos adjuntos?",
      answer: "El límite estándar es de 25 MB por correo electrónico (incluyendo todos los adjuntos). Si necesitas enviar archivos más grandes, te recomendamos usar servicios de almacenamiento en la nube como Google Drive, Dropbox o WeTransfer, y compartir el enlace en el correo. Para clientes empresariales con necesidades especiales, contacta a soporte para evaluar opciones personalizadas.",
      category: "Email"
    },
    {
      id: "email-10",
      question: "¿Cómo cambio la contraseña de mi cuenta de correo?",
      answer: "Para cambiar tu contraseña: 1) Accede al panel de control de tu hosting o cPanel. 2) Ve a la sección 'Cuentas de correo electrónico'. 3) Encuentra tu cuenta y haz clic en 'Cambiar contraseña'. 4) Ingresa la nueva contraseña (recomendamos mínimo 12 caracteres con mayúsculas, minúsculas, números y símbolos). 5) Guarda los cambios. Después, actualiza la contraseña en todos tus dispositivos y clientes de correo. Si no tienes acceso al panel, contacta a soporte.",
      category: "Email"
    },
    {
      id: "email-11",
      question: "¿Puedo usar mi correo con una aplicación de terceros?",
      answer: "Sí, puedes usar cualquier cliente de correo que soporte IMAP/POP3/SMTP, como: Microsoft Outlook, Mozilla Thunderbird, Apple Mail, Gmail (app), Samsung Email, BlueMail, Spark, etc. También puedes usar aplicaciones de gestión empresarial como Zoho Mail o HubSpot. Solo necesitas los datos de configuración del servidor que proporcionamos.",
      category: "Email"
    },
    {
      id: "email-12",
      question: "¿Cómo configuro alias de correo o reenvíos?",
      answer: "Los alias y reenvíos se configuran desde el panel de control: ALIAS: Crea direcciones alternativas que reciben en la misma bandeja (ejemplo: ventas@, info@, contacto@ → todas van a admin@tudominio.com). REENVÍOS: Redirige automáticamente los correos de una dirección a otra. Ambas opciones están en cPanel > 'Forwarders' o 'Alias de correo'. No consumen espacio adicional y son ideales para organizar tu comunicación.",
      category: "Email"
    },
    {
      id: "email-13",
      question: "¿Qué es SPF, DKIM y DMARC?",
      answer: "Son protocolos de autenticación de correo: SPF (Sender Policy Framework): Define qué servidores pueden enviar correos desde tu dominio. DKIM (DomainKeys Identified Mail): Firma digitalmente tus correos para verificar autenticidad. DMARC (Domain-based Message Authentication): Indica a otros servidores cómo manejar correos que fallan SPF/DKIM. Configurar estos registros DNS mejora significativamente la entrega de tus correos y previene suplantación de identidad. Contacta a soporte para ayuda con la configuración.",
      category: "Email"
    },
    {
      id: "email-14",
      question: "Mi bandeja de entrada está llena, ¿qué hago?",
      answer: "Soluciones: 1) ELIMINAR CORREOS ANTIGUOS: Borra correos innecesarios, especialmente los que tienen adjuntos grandes. 2) CONFIGURAR IMAP: Usa IMAP en lugar de POP3 para gestionar mejor el almacenamiento. 3) ARCHIVAR: Descarga correos importantes a tu PC y elimínalos del servidor. 4) LIMPIAR SPAM: Vacía las carpetas de spam y papelera regularmente. 5) AMPLIAR ESPACIO: Contacta con nosotros para aumentar la cuota de almacenamiento de tu cuenta. El espacio estándar es de 5 GB.",
      category: "Email"
    },
    {
      id: "email-15",
      question: "¿Cómo configuro respuestas automáticas (autoresponder)?",
      answer: "Para configurar respuestas automáticas: 1) Accede a cPanel o tu panel de control. 2) Ve a 'Autoresponders' o 'Respuestas automáticas'. 3) Crea un nuevo autoresponder. 4) Selecciona la cuenta de correo. 5) Define el mensaje de respuesta automática. 6) Establece fechas de inicio y fin (opcional). 7) Configura el intervalo entre respuestas a la misma persona. Ideal para vacaciones, ausencias o confirmaciones automáticas. Puedes personalizar el mensaje con variables como nombre del remitente.",
      category: "Email"
    }
  ];

  const quickLinks = [
    {
      title: "Crear una Cuenta",
      description: "Registro paso a paso",
      url: "/register/buyer"
    },
    {
      title: "Verificar Identidad",
      description: "Proceso KYC completo",
      url: "/help/verification"
    },
    {
      title: "Primera Compra",
      description: "Guía para compradores",
      url: "/help/buying-guide"
    },
    {
      title: "Vender un Activo",
      description: "Guía para vendedores", 
      url: "/help/selling-guide"
    },
    {
      title: "Configurar 2FA",
      description: "Seguridad adicional",
      url: "/help/security"
    },
    {
      title: "Métodos de Pago",
      description: "Opciones disponibles",
      url: "/help/payments"
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      {/* Hero Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-8 shadow-lg">
            <HelpCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-roboto font-black text-foreground mb-6 tracking-tight">
            Centro de Ayuda
          </h1>
          <p className="text-xl text-muted-foreground font-roboto max-w-3xl mx-auto leading-relaxed mb-8">
            Encuentra respuestas rápidas a tus preguntas sobre ADOMINIOZ. 
            Si no encuentras lo que buscas, nuestro equipo está aquí para ayudarte.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar en el centro de ayuda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 text-lg"
            />
          </div>

          {/* Contact Options */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/user/soporte">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:shadow-xl">
                <MessageCircle className="w-5 h-5 mr-2" />
                Crear Ticket de Soporte
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5">
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat en Vivo
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-roboto font-bold text-foreground mb-6">
              Enlaces Rápidos
            </h2>
            <p className="text-lg text-muted-foreground">
              Acceso directo a los temas más consultados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {link.title}
                  </CardTitle>
                  <CardDescription>
                    {link.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-end">
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-roboto font-bold text-foreground mb-6">
              Categorías de Ayuda
            </h2>
            <p className="text-lg text-muted-foreground">
              Explora nuestras guías organizadas por tema
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <category.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {category.title}
                  </CardTitle>
                  <CardDescription>
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
                    <Book className="w-4 h-4" />
                    <span>{category.articles} artículos</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-roboto font-bold text-foreground mb-6">
              Preguntas Frecuentes
            </h2>
            <p className="text-lg text-muted-foreground">
              Respuestas a las consultas más comunes de nuestros usuarios
            </p>
          </div>

          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <Collapsible
                key={faq.id}
                open={openFAQ === faq.id}
                onOpenChange={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
              >
                <CollapsibleTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-md transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-left">
                          {faq.question}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {faq.category}
                          </span>
                          {openFAQ === faq.id ? (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Card className="mt-2">
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No se encontraron preguntas
              </h3>
              <p className="text-muted-foreground mb-6">
                Intenta con otros términos de búsqueda o contacta directamente con soporte
              </p>
              <Link to="/user/soporte">
                <Button className="bg-gradient-to-r from-primary to-secondary">
                  Contactar Soporte
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-roboto font-bold text-foreground mb-6">
            ¿Necesitas Más Ayuda?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Nuestro equipo de soporte especializado está disponible 24/7 para ayudarte 
            con cualquier consulta específica.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Chat en Vivo</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Respuesta inmediata para consultas urgentes
              </p>
              <Button variant="outline" size="sm">
                Iniciar Chat
              </Button>
            </Card>
            
            <Card className="text-center p-6">
              <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-sm text-muted-foreground mb-4">
                support@adominioz.com
              </p>
              <Button variant="outline" size="sm">
                Enviar Email
              </Button>
            </Card>
            
            <Card className="text-center p-6">
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Tickets</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Sistema de tickets para seguimiento detallado
              </p>
              <Link to="/user/soporte">
                <Button variant="outline" size="sm">
                  Crear Ticket
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenter;