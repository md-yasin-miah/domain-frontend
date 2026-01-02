import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-muted/30 border-t border-border/40 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <img
              src="/lovable-uploads/c4e923e1-17e4-42b9-90b4-d79eed7fcc19.png"
              alt="ADOMINIOZ"
              className="h-8 w-auto"
            />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Plataforma líder en trading de activos digitales con máxima seguridad y transparencia. Operamos como
              marketplace con estrictas medidas de protección.
            </p>
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground">ADOMINIOZ</p>
              <p>(DBA of ROC Worldwide Agency LLC)</p>
              <p>9002 Six Pines Dr Suite 277</p>
              <p>Shenandoah, TX 77380, USA</p>
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <div className="space-y-2 text-sm">
              <Link
                to="/legal/terminos"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Términos y Condiciones
              </Link>
              <Link
                to="/legal/privacidad"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Política de Privacidad
              </Link>
              <Link to="/legal/aml" className="block text-muted-foreground hover:text-primary transition-colors">
                AML/KYC
              </Link>
              <Link to="/legal/cookies" className="block text-muted-foreground hover:text-primary transition-colors">
                Política de Cookies
              </Link>
              <Link
                to="/legal/aviso-legal"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Aviso Legal
              </Link>
              <Link
                to="/legal/proteccion-datos"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Protección de Datos
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Soporte</h4>
            <div className="space-y-2 text-sm">
              <Link
                to="/resources/help"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Centro de Ayuda
              </Link>
              <Link
                to="/user/soporte"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Sistema de Tickets
              </Link>
              <span className="block text-muted-foreground">Chat en vivo disponible</span>
              <Link
                to="/resources/guides"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Guías y Tutoriales
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contacto</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Email: support@adominioz.com</p>
              <p>ADOMINIOZ - DBA: ROC Worldwide Agency LLC</p>
              <p>9002 Six Pines Dr Suite 277</p>
              <p>Shenandoah, TX 77380, USA</p>
            </div>
          </div>
        </div>

        {/* Bottom Section - Enhanced Legal Protection */}
        <div className="border-t border-border/40 mt-8 pt-8 space-y-4">
          <div className="text-xs text-muted-foreground text-center md:text-left">
            <p>&copy; 2024 ADOMINIOZ (DBA of ROC Worldwide Agency LLC). Todos los derechos reservados.</p>
            <p className="mt-1">Operamos conforme a las leyes federales y estatales aplicables en Estados Unidos.</p>
          </div>

          {/* Risk Warning & Legal Protection */}
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="text-xs text-muted-foreground space-y-2">
              <p className="font-medium text-warning">⚠️ AVISO DE RIESGO DE INVERSIÓN:</p>
              <p>
                El trading de activos digitales conlleva riesgos significativos. El valor de las inversiones puede
                fluctuar y existe la posibilidad de pérdida total o parcial del capital invertido. ADOMINIOZ actúa
                únicamente como marketplace y no ofrece asesoramiento financiero. Los compradores y vendedores son
                responsables de sus decisiones de inversión.
              </p>
              <p className="font-medium text-foreground">
                PROTECCIÓN DE ACTIVOS: Todos los activos, bienes y propiedades intelectuales de ROC Worldwide Agency
                LLC están protegidos por las leyes de Estados Unidos. Limitamos nuestra responsabilidad conforme a la
                ley aplicable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

