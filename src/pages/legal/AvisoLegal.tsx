const AvisoLegal = () => {
  return (
    <div className="min-h-screen bg-background py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-8">Aviso Legal</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Información General</h2>
            <div className="bg-accent/10 p-4 rounded-lg">
              <p><strong>Denominación:</strong> ADOMINIOZ (DBA of ROC Worldwide Agency LLC)</p>
              <p><strong>Dirección:</strong> 9002 Six Pines Dr Suite 277, Shenandoah, TX 77380, USA</p>
              <p><strong>Jurisdicción:</strong> Estado de Texas, Estados Unidos</p>
              <p><strong>Actividad:</strong> Plataforma de trading de activos digitales</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Objeto y Aceptación</h2>
            <p>
              Este aviso legal regula el uso del sitio web www.adominioz.com (en adelante, "la Plataforma"),
              propiedad de ROC Worldwide Agency LLC, que opera bajo el nombre comercial ADOMINIOZ.
            </p>
            <p className="mt-2">
              El acceso y uso de la Plataforma implica la aceptación plena de todos los términos
              contenidos en este aviso legal y en nuestros Términos y Condiciones.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Propiedad Intelectual</h2>
            <p>
              Todos los contenidos de la Plataforma, incluyendo pero no limitado a textos, imágenes,
              gráficos, logotipos, iconos, software y su estructura, están protegidos por derechos
              de propiedad intelectual de conformidad con las leyes de Estados Unidos.
            </p>
            <p className="mt-2">
              Queda prohibida la reproducción, distribución, comunicación pública y transformación
              de estos contenidos sin autorización expresa del titular.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Limitación de Responsabilidad</h2>
            <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
              <p className="font-semibold text-destructive mb-2">AVISO IMPORTANTE:</p>
              <p>
                ADOMINIOZ actúa como intermediario en las transacciones de activos digitales.
                No ofrecemos asesoramiento financiero ni garantizamos el rendimiento de las inversiones.
              </p>
              <p className="mt-2">
                El trading de activos digitales conlleva riesgos significativos, incluyendo la pérdida
                total o parcial del capital invertido. Los usuarios deben evaluar cuidadosamente
                su situación financiera antes de participar.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Protección de Activos Empresariales</h2>
            <p>
              Todos los activos, bienes, propiedades intelectuales y recursos de ROC Worldwide Agency LLC
              y ADOMINIOZ están protegidos por las leyes aplicables de Estados Unidos.
            </p>
            <p className="mt-2">
              Cualquier intento de apropiación indebida, uso no autorizado o daño a nuestros activos
              será perseguido con el máximo rigor de la ley.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Ley Aplicable y Jurisdicción</h2>
            <p>
              Este aviso legal se rige por las leyes del Estado de Texas y las leyes federales
              de Estados Unidos. Cualquier controversia será resuelta por los tribunales competentes
              de Texas, Estados Unidos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Contacto</h2>
            <p>
              Para cualquier consulta legal o relacionada con este aviso, puede contactarnos a través de:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Chat en vivo disponible en la plataforma</li>
              <li>Sistema de tickets desde su panel de usuario</li>
              <li>Email: legal@adominioz.com</li>
            </ul>
          </section>

          <div className="bg-primary/10 p-4 rounded-lg mt-8">
            <p className="text-sm">
              <strong>Operamos conforme a las leyes federales y estatales aplicables en EE.UU.</strong><br />
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AvisoLegal