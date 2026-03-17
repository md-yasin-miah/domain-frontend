import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/lib/routes';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-muted/30 border-t border-border/40 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <img
              src="/uploads/logo-full.png"
              alt={t('footer.company_name')}
              className="h-8 w-auto"
            />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.company_desc')}
            </p>
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground">{t('footer.company_name')}</p>
              <p>{t('footer.company_dba')}</p>
              <p>{t('footer.address_line1')}</p>
              <p>{t('footer.address_line2')}</p>
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">{t('footer.legal_title')}</h4>
            <div className="space-y-2 text-sm">
              <Link
                to="/legal/terminos"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                {t('footer.terms')}
              </Link>
              <Link
                to="/legal/privacidad"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                {t('footer.privacy')}
              </Link>
              <Link to="/legal/aml" className="block text-muted-foreground hover:text-primary transition-colors">
                {t('footer.aml_kyc')}
              </Link>
              <Link to="/legal/cookies" className="block text-muted-foreground hover:text-primary transition-colors">
                {t('footer.cookies')}
              </Link>
              <Link
                to="/legal/aviso-legal"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                {t('footer.legal_notice')}
              </Link>
              <Link
                to="/legal/proteccion-datos"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                {t('footer.data_protection')}
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">{t('footer.support_title')}</h4>
            <div className="space-y-2 text-sm">
              <Link
                to={ROUTES.APP.HELP_CENTER.ROOT}
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                {t('footer.help_center')}
              </Link>
              <Link
                to="/user/soporte"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                {t('footer.ticket_system')}
              </Link>
              <span className="block text-muted-foreground">{t('footer.live_chat')}</span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">{t('footer.contact_title')}</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{t('footer.email')}</p>
              <p>{t('footer.contact_company_line')}</p>
              <p>{t('footer.address_line1')}</p>
              <p>{t('footer.address_line2')}</p>
            </div>
          </div>
        </div>

        {/* Bottom Section - Enhanced Legal Protection */}
        <div className="border-t border-border/40 mt-8 pt-8 space-y-4">
          <div className="text-xs text-muted-foreground text-center md:text-left">
            <p>{t('footer.copyright')}</p>
            <p className="mt-1">{t('footer.legal_compliance')}</p>
          </div>

          {/* Risk Warning & Legal Protection */}
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="text-xs text-muted-foreground space-y-2">
              <p className="font-medium text-warning">{t('footer.risk_warning_title')}</p>
              <p>
                {t('footer.risk_warning_body')}
              </p>
              <p className="font-medium text-foreground">
                {t('footer.asset_protection_title')} {t('footer.asset_protection_body')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

