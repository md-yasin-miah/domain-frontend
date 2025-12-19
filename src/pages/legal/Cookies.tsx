const Cookies = () => {
  return (
    <div className="min-h-screen bg-background py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-8">Política de Cookies</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. ¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita nuestro sitio web.
              Nos ayudan a mejorar su experiencia de navegación y el funcionamiento de nuestra plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Tipos de cookies que utilizamos</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground">Cookies esenciales</h3>
                <p>Necesarias para el funcionamiento básico del sitio web y para la autenticación de usuarios.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground">Cookies de preferencias</h3>
                <p>Recuerdan sus preferencias como el idioma seleccionado y configuraciones de la interfaz.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground">Cookies analíticas</h3>
                <p>Nos ayudan a entender cómo los usuarios interactúan con nuestro sitio web para mejorarlo.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground">Cookies de marketing</h3>
                <p>Utilizadas para mostrar contenido relevante y medir la efectividad de nuestras campañas.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Control de cookies</h2>
            <p>
              Puede controlar y gestionar las cookies a través de la configuración de su navegador.
              Tenga en cuenta que deshabilitar ciertas cookies puede afectar la funcionalidad del sitio web.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Cookies de terceros</h2>
            <p>
              Algunos servicios de terceros que utilizamos pueden establecer sus propias cookies.
              Estos incluyen servicios de análisis, chat en vivo y procesamiento de pagos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Actualizaciones</h2>
            <p>
              Esta política de cookies puede actualizarse periódicamente.
              Le recomendamos revisarla regularmente para mantenerse informado sobre nuestras prácticas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Contacto</h2>
            <p>
              Si tiene preguntas sobre esta política de cookies, puede contactarnos a través de:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Chat en vivo en nuestro sitio web</li>
              <li>Sistema de tickets en su panel de usuario</li>
              <li>Email: legal@adominioz.com</li>
            </ul>
          </section>

          <div className="bg-accent/10 p-4 rounded-lg mt-8">
            <p className="text-sm">
              <strong>ADOMINIOZ</strong> (DBA of ROC Worldwide Agency LLC)<br />
              9002 Six Pines Dr Suite 277, Shenandoah, TX 77380, USA<br />
              Operamos conforme a las leyes federales y estatales aplicables en EE.UU.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cookies