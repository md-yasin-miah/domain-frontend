const ProteccionDatos = () => {
  return (
    <div className="min-h-screen bg-background py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-roboto font-black text-foreground mb-8">Política de Protección de Datos</h1>
        
        <div className="prose prose-lg max-w-none text-muted-foreground font-roboto">
          <div className="bg-accent/10 p-4 rounded-lg mb-6">
            <p className="text-sm">
              <strong>ADOMINIOZ</strong> (DBA of ROC Worldwide Agency LLC)<br />
              9002 Six Pines Dr Suite 277, Shenandoah, TX 77380, USA<br />
              Cumplimiento de CCPA, CPRA y leyes federales de EE.UU.
            </p>
          </div>
          
          <p className="text-lg mb-8">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-roboto font-bold text-foreground mb-4">1. Introducción</h2>
            <p>
              ADOMINIOZ (DBA of ROC Worldwide Agency LLC) se compromete a proteger la privacidad
              de nuestros usuarios conforme a las leyes de privacidad aplicables en Estados Unidos,
              incluyendo la California Consumer Privacy Act (CCPA) y la California Privacy Rights Act (CPRA).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Información que Recopilamos</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-foreground">Información de Identificación Personal:</h3>
                <ul className="list-disc list-inside ml-4">
                  <li>Nombre completo, dirección de email, número de teléfono</li>
                  <li>Dirección física y información de facturación</li>
                  <li>Documentos de identificación (para verificación KYC)</li>
                  <li>Información financiera y bancaria</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground">Información de Uso:</h3>
                <ul className="list-disc list-inside ml-4">
                  <li>Actividad en la plataforma y transacciones</li>
                  <li>Preferencias de usuario y configuraciones</li>
                  <li>Información de dispositivos y conexión</li>
                  <li>Cookies y tecnologías similares</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Uso de la Información</h2>
            <p>Utilizamos su información personal para:</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Proporcionar y mejorar nuestros servicios de trading</li>
              <li>Verificar su identidad y cumplir con regulaciones (KYC/AML)</li>
              <li>Procesar transacciones y pagos</li>
              <li>Comunicarnos con usted sobre su cuenta y servicios</li>
              <li>Detectar y prevenir fraudes y actividades ilícitas</li>
              <li>Cumplir con obligaciones legales y regulatorias</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Sus Derechos de Privacidad</h2>
            <div className="bg-accent/10 p-4 rounded-lg">
              <p className="font-semibold text-foreground mb-2">Bajo las leyes de privacidad de EE.UU., usted tiene derecho a:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Conocer qué información personal recopilamos sobre usted</li>
                <li>Solicitar la eliminación de su información personal</li>
                <li>Solicitar la corrección de información inexacta</li>
                <li>Optar por no participar en la venta de información personal</li>
                <li>No ser discriminado por ejercer sus derechos de privacidad</li>
                <li>Designar un agente autorizado para hacer solicitudes en su nombre</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Compartir Información</h2>
            <p>
              No vendemos información personal. Podemos compartir información con:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Proveedores de servicios que nos ayudan a operar la plataforma</li>
              <li>Autoridades regulatorias cuando sea requerido por ley</li>
              <li>Terceros en caso de fusiones o adquisiciones</li>
              <li>Otras partes con su consentimiento explícito</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Seguridad de Datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas, administrativas y físicas apropiadas
              para proteger su información personal contra acceso no autorizado, alteración,
              divulgación o destrucción.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Retención de Datos</h2>
            <p>
              Conservamos su información personal durante el tiempo necesario para cumplir con
              los propósitos descritos en esta política, incluyendo el cumplimiento de
              obligaciones legales, regulatorias y de auditoría.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Transferencias Internacionales</h2>
            <p>
              Su información puede ser transferida y procesada en Estados Unidos y otros países
              donde operamos o donde se encuentran nuestros proveedores de servicios.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Ejercer Sus Derechos</h2>
            <p>
              Para ejercer sus derechos de privacidad, puede contactarnos a través de:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Chat en vivo en nuestro sitio web</li>
              <li>Sistema de tickets en su panel de usuario</li>
              <li>Email: privacy@adominioz.com</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Actualizaciones</h2>
            <p>
              Esta política puede actualizarse periódicamente. Le notificaremos sobre
              cambios materiales a través de la plataforma o por email.
            </p>
          </section>

          <div className="bg-accent/10 p-4 rounded-lg mt-8">
            <p className="text-sm">
              <strong>ADOMINIOZ</strong> (DBA of ROC Worldwide Agency LLC)<br />
              9002 Six Pines Dr Suite 277, Shenandoah, TX 77380, USA<br />
              Email: privacy@adominioz.com<br />
              Operamos conforme a las leyes federales y estatales aplicables en EE.UU.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProteccionDatos