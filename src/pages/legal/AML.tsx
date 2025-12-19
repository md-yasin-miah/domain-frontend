const AML = () => {
  return (
    <div className="min-h-screen bg-background py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-roboto font-black text-foreground mb-8">
          Política AML/KYC
        </h1>
        
        <div className="prose prose-lg max-w-none text-muted-foreground font-roboto">
          <div className="bg-accent/10 p-4 rounded-lg mb-6">
            <p className="text-sm">
              <strong>ADOMINIOZ</strong> (DBA of ROC Worldwide Agency LLC)<br />
              9002 Six Pines Dr Suite 277, Shenandoah, TX 77380, USA<br />
              Conforme a las regulaciones AML/BSA de Estados Unidos y FinCEN
            </p>
          </div>
          
          <p className="text-lg mb-8">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-roboto font-bold text-foreground mb-4">1. Compromiso con el Cumplimiento</h2>
            <p>
              ADOMINIOZ está comprometido con la prevención del lavado de dinero y el financiamiento del terrorismo. 
              Cumplimos con todas las regulaciones AML/KYC aplicables en Estados Unidos y jurisdicciones internacionales.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-roboto font-bold text-foreground mb-4">2. Proceso de Verificación KYC</h2>
            <p>
              Todos los usuarios deben completar la verificación KYC que incluye:
            </p>
            <ul className="list-disc ml-6 mt-4">
              <li>Verificación de identidad con documento oficial</li>
              <li>Prueba de domicilio actualizada</li>
              <li>Declaración de origen de fondos</li>
              <li>Verificación biométrica cuando sea requerida</li>
              <li>Screening contra listas de sanciones internacionales</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-roboto font-bold text-foreground mb-4">3. Monitoreo de Transacciones</h2>
            <p>
              Implementamos sistemas avanzados de monitoreo que incluyen:
            </p>
            <ul className="list-disc ml-6 mt-4">
              <li>Análisis de patrones de transacciones sospechosas</li>
              <li>Verificación de origen de criptomonedas</li>
              <li>Límites de transacción basados en nivel de verificación</li>
              <li>Revisión manual de operaciones de alto valor</li>
              <li>Reportes automáticos a autoridades cuando sea necesario</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-roboto font-bold text-foreground mb-4">4. Personas Políticamente Expuestas (PEP)</h2>
            <p>
              Para usuarios identificados como PEP aplicamos:
            </p>
            <ul className="list-disc ml-6 mt-4">
              <li>Due diligence reforzada</li>
              <li>Verificación adicional de origen de fondos</li>
              <li>Aprobación de la alta dirección</li>
              <li>Monitoreo continuo aumentado</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-roboto font-bold text-foreground mb-4">5. Sanciones y Restricciones</h2>
            <p>
              No proporcionamos servicios a:
            </p>
            <ul className="list-disc ml-6 mt-4">
              <li>Personas o entidades en listas de sanciones</li>
              <li>Residentes de países con restricciones</li>
              <li>Usuarios que no completen la verificación KYC</li>
              <li>Actividades relacionadas con jurisdicciones de alto riesgo</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-roboto font-bold text-foreground mb-4">6. Reporte de Actividades Sospechosas</h2>
            <p>
              Si detecta actividad sospechosa, puede reportarla a:
            </p>
            <ul className="list-disc ml-6 mt-4">
              <li>Email: compliance@adominioz.com</li>
              <li>Sistema de tickets desde su panel de usuario</li>
              <li>Chat en vivo disponible en la plataforma</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-roboto font-bold text-foreground mb-4">7. Cooperación con Autoridades</h2>
            <p>
              ADOMINIOZ coopera plenamente con:
            </p>
            <ul className="list-disc ml-6 mt-4">
              <li>FinCEN (Financial Crimes Enforcement Network) - EE.UU.</li>
              <li>IRS (Internal Revenue Service) - EE.UU.</li>
              <li>SEC (Securities and Exchange Commission) - EE.UU.</li>
              <li>Autoridades internacionales cuando sea requerido por ley</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AML;