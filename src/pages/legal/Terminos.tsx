const Terminos = () => {
  return (
    <div className="min-h-screen bg-background py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-roboto font-black text-foreground mb-8">
          Términos y Condiciones
        </h1>
        
        <div className="prose prose-lg max-w-none text-muted-foreground font-roboto">
          <div className="bg-accent/10 p-4 rounded-lg mb-6">
            <p className="text-sm">
              <strong>ADOMINIOZ</strong> (DBA of ROC Worldwide Agency LLC)<br />
              9002 Six Pines Dr Suite 277, Shenandoah, TX 77380, USA<br />
              Jurisdicción: Estado de Texas, Estados Unidos<br />
              Operamos conforme a las leyes federales y estatales aplicables en EE.UU.
            </p>
          </div>
          
          <p className="text-lg mb-8">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-roboto font-bold text-foreground mb-4">1. Aceptación de los Términos</h2>
            <p>
              Al acceder y utilizar ADOMINIOZ ("la Plataforma"), operada por ROC Worldwide Agency LLC, 
              usted acepta estar sujeto a estos Términos y Condiciones y a todas las leyes federales y estatales 
              aplicables en Estados Unidos. Si no está de acuerdo con alguno de estos términos, 
              no debe utilizar esta plataforma.
            </p>
            <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20 mt-4">
              <p className="font-semibold text-destructive mb-2">AVISO DE RIESGO:</p>
              <p>
                El trading de activos digitales conlleva riesgos significativos. No ofrecemos asesoramiento financiero.
                Puede perder todo o parte de su inversión. Evalúe cuidadosamente su situación financiera antes de participar.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-roboto font-bold text-foreground mb-4">2. Descripción del Servicio</h2>
            <p>
              ADOMINIOZ es un marketplace digital que facilita la compra y venta de activos digitales incluyendo:
            </p>
            <ul className="list-disc ml-6 mt-4">
              <li>Dominios premium</li>
              <li>Sitios web con ingresos</li>
              <li>Aplicaciones móviles</li>
              <li>NFTs y activos blockchain</li>
              <li>Negocios de comercio electrónico</li>
              <li>Software y aplicaciones SaaS</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-roboto font-bold text-foreground mb-4">3. Registro y Verificación</h2>
            <p>
              Para utilizar los servicios de ADOMINIOZ, debe:
            </p>
            <ul className="list-disc ml-6 mt-4">
              <li>Ser mayor de 18 años o tener la mayoría de edad en su jurisdicción</li>
              <li>Proporcionar información precisa y completa durante el registro</li>
              <li>Completar el proceso de verificación KYC (Know Your Customer)</li>
              <li>Mantener la confidencialidad de sus credenciales de acceso</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-roboto font-bold text-foreground mb-4">4. Servicios de Escrow</h2>
            <p>
              ADOMINIOZ proporciona servicios de escrow para garantizar transacciones seguras:
            </p>
            <ul className="list-disc ml-6 mt-4">
              <li>Los fondos se mantienen en custodia hasta completar la transferencia</li>
              <li>La liberación de fondos requiere confirmación de ambas partes</li>
              <li>En caso de disputa, ADOMINIOZ actuará como mediador</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-roboto font-bold text-foreground mb-4">5. Tarifas y Pagos</h2>
            <p>
              ADOMINIOZ cobra una comisión del 5% sobre el valor de cada transacción exitosa. 
              Aceptamos los siguientes métodos de pago:
            </p>
            <ul className="list-disc ml-6 mt-4">
              <li>Bitcoin (BTC)</li>
              <li>Ethereum (ETH)</li>
              <li>Tether (USDT)</li>
              <li>Tarjetas de crédito/débito</li>
              <li>Transferencias bancarias</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-roboto font-bold text-foreground mb-4">6. Limitación de Responsabilidad y Protección de Activos</h2>
            <div className="bg-accent/10 p-4 rounded-lg mb-4">
              <p className="font-semibold text-foreground mb-2">PROTECCIÓN DE EMPRESA Y ACTIVOS:</p>
              <p>
                ROC Worldwide Agency LLC y ADOMINIOZ limitan su responsabilidad al máximo permitido por la ley de Estados Unidos. 
                Todos nuestros activos empresariales, bienes, propiedades intelectuales, datos y recursos están estrictamente protegidos 
                por las leyes federales y estatales de Estados Unidos.
              </p>
            </div>
            <p>
              Como marketplace de activos digitales, ADOMINIOZ facilita transacciones entre compradores y vendedores independientes. 
              No somos responsables por:
            </p>
            <ul className="list-disc ml-6 mt-4">
              <li>La calidad, legalidad, exactitud o autenticidad de los activos listados por vendedores</li>
              <li>Pérdidas derivadas de fluctuaciones en el valor de activos digitales o criptomonedas</li>
              <li>Interrupciones del servicio por mantenimiento, actualizaciones o eventos de fuerza mayor</li>
              <li>Pérdidas de inversión, daños indirectos, consecuenciales o lucro cesante</li>
              <li>Decisiones de inversión tomadas por usuarios basadas en información de la plataforma</li>
              <li>Disputas entre compradores y vendedores más allá de nuestros servicios de mediación</li>
            </ul>
            <div className="bg-warning/10 p-4 rounded-lg mt-4 border border-warning/20">
              <p className="font-semibold text-warning mb-2">⚠️ AVISO IMPORTANTE:</p>
              <p>
                Los usuarios reconocen expresamente que cualquier intento de apropiación indebida, uso no autorizado, 
                daño o interferencia con nuestros activos, sistemas, datos o propiedades intelectuales será perseguido 
                legalmente con el máximo rigor de la ley federal y estatal de Estados Unidos.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-roboto font-bold text-foreground mb-4">7. Riesgos de Inversión y Disclaimer</h2>
            <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
              <p className="font-semibold text-destructive mb-2">AVISO DE RIESGO:</p>
              <p>
                El trading de activos digitales conlleva riesgos financieros significativos. No ofrecemos asesoramiento financiero, 
                de inversión o fiscal. Los valores pueden fluctuar sustancialmente y existe riesgo de pérdida total del capital. 
                Los usuarios deben consultar con asesores financieros calificados antes de tomar decisiones de inversión.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-roboto font-bold text-foreground mb-4">8. Ley Aplicable y Jurisdicción</h2>
            <p>
              Estos términos se rigen exclusivamente por las leyes del Estado de Texas y las leyes federales de Estados Unidos, 
              sin dar efecto a principios de conflicto de leyes. Cualquier disputa legal será resuelta exclusivamente en los 
              tribunales estatales o federales competentes ubicados en Texas, Estados Unidos.
            </p>
            <p className="mt-2">
              Al usar nuestra plataforma, usted consiente irrevocablemente a la jurisdicción personal de dichos tribunales 
              y renuncia a cualquier objeción sobre venue o foro inconveniente.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-roboto font-bold text-foreground mb-4">9. Contacto Legal</h2>
            <p>
              Para consultas relacionadas con estos términos y condiciones, contacte exclusivamente a través de:
            </p>
            <ul className="list-disc ml-6 mt-4">
              <li>Chat en vivo disponible en la plataforma (recomendado)</li>
              <li>Sistema de tickets desde su panel de usuario</li>
              <li>Email legal: legal@adominioz.com</li>
            </ul>
            <div className="bg-accent/10 p-4 rounded-lg mt-4">
              <p className="text-sm">
                <strong>ADOMINIOZ</strong> (DBA of ROC Worldwide Agency LLC)<br />
                9002 Six Pines Dr Suite 277, Shenandoah, TX 77380, USA<br />
                Jurisdicción: Estado de Texas, Estados Unidos<br />
                <em>No se proporciona soporte telefónico. Utilice únicamente los canales digitales indicados.</em>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terminos;