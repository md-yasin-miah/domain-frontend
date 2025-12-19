const Privacidad = () => {
  return (
    <div className="min-h-screen bg-background py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-roboto font-black text-foreground mb-8">
          Política de Privacidad
        </h1>
        
        <div className="prose prose-lg max-w-none text-muted-foreground font-roboto">
          <div className="bg-accent/10 p-4 rounded-lg mb-6">
            <p className="text-sm">
              <strong>ADOMINIOZ</strong> (DBA of ROC Worldwide Agency LLC)<br />
              9002 Six Pines Dr Suite 277, Shenandoah, TX 77380, USA<br />
              Conforme a las leyes de privacidad de EE.UU. (CCPA/CPRA)
            </p>
          </div>
          
          <p className="text-lg mb-8">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-roboto font-bold text-foreground mb-4">1. Información que Recopilamos</h2>
            <p>
              Conforme a las leyes de privacidad de Estados Unidos, recopilamos la siguiente información:
            </p>
            <ul className="list-disc ml-6 mt-4">
              <li>Información de identificación personal (nombre, email, dirección)</li>
              <li>Documentos de verificación de identidad (KYC/AML)</li>
              <li>Información financiera y bancaria para transacciones</li>
              <li>Datos de uso de la plataforma y preferencias</li>
              <li>Información de dispositivos y conexión</li>
              <li>Cookies y tecnologías de seguimiento</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-roboto font-bold text-foreground mb-4">2. Uso de la Información</h2>
            <p>
              Utilizamos su información para:
            </p>
            <ul className="list-disc ml-6 mt-4">
              <li>Verificar su identidad y cumplir con regulaciones AML/KYC</li>
              <li>Procesar transacciones y servicios de escrow</li>
              <li>Mejorar nuestros servicios y seguridad</li>
              <li>Comunicarnos con usted sobre su cuenta</li>
              <li>Cumplir con obligaciones legales y regulatorias</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-roboto font-bold text-foreground mb-4">3. Compartir Información</h2>
            <p>
              Podemos compartir su información con:
            </p>
            <ul className="list-disc ml-6 mt-4">
              <li>Proveedores de servicios de pago y verificación</li>
              <li>Autoridades regulatorias cuando sea requerido por ley</li>
              <li>Auditores y asesores legales</li>
              <li>Otras partes con su consentimiento explícito</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-roboto font-bold text-foreground mb-4">4. Seguridad de Datos</h2>
            <p>
              Implementamos medidas de seguridad robustas:
            </p>
            <ul className="list-disc ml-6 mt-4">
              <li>Encriptación de datos sensibles</li>
              <li>Autenticación de dos factores</li>
              <li>Monitoreo continuo de seguridad</li>
              <li>Acceso limitado basado en roles</li>
              <li>Auditorías de seguridad regulares</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-roboto font-bold text-foreground mb-4">5. Sus Derechos de Privacidad</h2>
            <div className="bg-accent/10 p-4 rounded-lg">
              <p className="font-semibold text-foreground mb-2">Bajo las leyes de privacidad de EE.UU., usted tiene derecho a:</p>
              <ul className="list-disc ml-6 mt-2">
                <li>Conocer qué información personal recopilamos sobre usted</li>
                <li>Solicitar la eliminación de su información personal</li>
                <li>Solicitar la corrección de información inexacta</li>
                <li>Optar por no participar en la venta de información personal</li>
                <li>No ser discriminado por ejercer sus derechos de privacidad</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-roboto font-bold text-foreground mb-4">6. Retención de Datos</h2>
            <p>
              Conservamos sus datos durante el tiempo necesario para cumplir con los propósitos descritos,
              incluyendo obligaciones legales, regulatorias y de auditoría:
            </p>
            <ul className="list-disc ml-6 mt-4">
              <li>Mientras mantenga una cuenta activa</li>
              <li>7 años después del cierre de cuenta (para cumplimiento regulatorio AML/KYC)</li>
              <li>El tiempo necesario para resolver disputas legales</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-roboto font-bold text-foreground mb-4">7. Ley Aplicable</h2>
            <p>
              Esta política se rige por las leyes de privacidad de Estados Unidos, incluyendo la CCPA y CPRA,
              así como las leyes federales y del Estado de Texas aplicables.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-roboto font-bold text-foreground mb-4">8. Contacto</h2>
            <p>
              Si tiene preguntas sobre esta política de privacidad o desea ejercer sus derechos, puede contactarnos:
            </p>
            <ul className="list-disc ml-6 mt-4">
              <li>Chat en vivo disponible en la plataforma</li>
              <li>Sistema de tickets desde su panel de usuario</li>
              <li>Email: privacy@adominioz.com</li>
            </ul>
            <p className="mt-4 text-sm">
              <strong>ADOMINIOZ</strong> (DBA of ROC Worldwide Agency LLC)<br />
              9002 Six Pines Dr Suite 277, Shenandoah, TX 77380, USA
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacidad;