import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Users, BookOpen, CheckCircle, Star, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface GuideContent {
  title: string;
  description: string;
  author: string;
  readTime: string;
  difficulty: "Básico" | "Intermedio" | "Avanzado";
  category: string;
  views: string;
  lastUpdated: string;
  tableOfContents: Array<{
    id: string;
    title: string;
    level: number;
  }>;
  content: Array<{
    type: "heading" | "paragraph" | "list" | "code" | "tip" | "warning";
    content: string;
    items?: string[];
    level?: number;
  }>;
  relatedGuides: Array<{
    title: string;
    url: string;
    readTime: string;
  }>;
}

const GuideDetail = () => {
  const { slug } = useParams();
  const [guide, setGuide] = useState<GuideContent | null>(null);

  const guides: Record<string, GuideContent> = {
    "guia-completa-como-valorar-un-dominio-premium": {
      title: "Guía Completa: Cómo Valorar un Dominio Premium",
      description: "Aprende los factores clave que determinan el valor de un dominio: tráfico, SEO, brandabilidad y más.",
      author: "Carlos Martinez",
      readTime: "15 min",
      difficulty: "Intermedio",
      category: "Valoración",
      views: "2.4K",
      lastUpdated: "2024-01-15",
      tableOfContents: [
        { id: "introduccion", title: "Introducción", level: 1 },
        { id: "factores-basicos", title: "Factores Básicos de Valoración", level: 1 },
        { id: "extension-dominio", title: "Extensión del Dominio", level: 2 },
        { id: "longitud-memorabilidad", title: "Longitud y Memorabilidad", level: 2 },
        { id: "metricas-seo", title: "Métricas SEO", level: 1 },
        { id: "trafico-organico", title: "Tráfico Orgánico", level: 2 },
        { id: "backlinks", title: "Perfil de Backlinks", level: 2 },
        { id: "valor-comercial", title: "Valor Comercial", level: 1 },
        { id: "herramientas", title: "Herramientas de Valoración", level: 1 },
        { id: "conclusion", title: "Conclusión", level: 1 }
      ],
      content: [
        {
          type: "heading",
          content: "Introducción",
          level: 1
        },
        {
          type: "paragraph",
          content: "La valoración de dominios es tanto un arte como una ciencia. Requiere entender múltiples factores que influyen en el valor percibido y real de un nombre de dominio en el mercado digital actual."
        },
        {
          type: "paragraph",
          content: "En esta guía completa, aprenderás los métodos profesionales utilizados por brokers y inversores experimentados para evaluar dominios premium y tomar decisiones de inversión informadas."
        },
        {
          type: "heading",
          content: "Factores Básicos de Valoración",
          level: 1
        },
        {
          type: "heading",
          content: "Extensión del Dominio",
          level: 2
        },
        {
          type: "paragraph",
          content: "La extensión (.com, .net, .org, etc.) es uno de los factores más importantes en la valoración:"
        },
        {
          type: "list",
          content: "Tipos de extensiones y su valor relativo",
          items: [
            ".COM - La extensión más valiosa, especialmente para uso comercial",
            ".NET - Segunda opción para sitios tecnológicos",
            ".ORG - Preferida por organizaciones sin fines de lucro",
            "ccTLD (.es, .mx, .ar) - Valiosas en sus mercados locales",
            "Nuevas extensiones (.tech, .store) - Valor limitado actualmente"
          ]
        },
        {
          type: "heading",
          content: "Longitud y Memorabilidad", 
          level: 2
        },
        {
          type: "paragraph",
          content: "Los dominios cortos y memorables tienen un valor significativamente mayor:"
        },
        {
          type: "list",
          content: "Criterios de longitud",
          items: [
            "1-3 caracteres: Extremadamente valiosos (millones de dólares)",
            "4-6 caracteres: Muy valiosos si son brandables",
            "7-12 caracteres: Valor moderado si contienen keywords",
            "13+ caracteres: Valor limitado, debe tener tráfico o ser exact match"
          ]
        },
        {
          type: "tip",
          content: "💡 Consejo: Un dominio de 6 letras brandable como 'Google.com' puede valer más que uno de 3 letras sin sentido."
        },
        {
          type: "heading",
          content: "Métricas SEO",
          level: 1
        },
        {
          type: "paragraph",
          content: "Las métricas de SEO son fundamentales para evaluar el potencial de un dominio:"
        },
        {
          type: "heading",
          content: "Tráfico Orgánico",
          level: 2
        },
        {
          type: "paragraph",
          content: "El tráfico orgánico existente es uno de los indicadores más valiosos:"
        },
        {
          type: "list",
          content: "Métricas clave de tráfico",
          items: [
            "Visitantes únicos mensuales",
            "Tiempo de permanencia en el sitio",
            "Tasa de rebote",
            "Páginas vistas por sesión",
            "Tendencia del tráfico (creciente/decreciente)"
          ]
        },
        {
          type: "code",
          content: "# Herramientas para analizar tráfico:\n- Google Analytics (si está configurado)\n- SimilarWeb\n- SEMrush\n- Ahrefs\n- Alexa (discontinuado pero datos históricos útiles)"
        },
        {
          type: "heading",
          content: "Perfil de Backlinks",
          level: 2
        },
        {
          type: "paragraph",
          content: "La calidad y cantidad de backlinks determina la autoridad del dominio:"
        },
        {
          type: "list",
          content: "Factores importantes en backlinks",
          items: [
            "Domain Authority (DA) y Domain Rating (DR)",
            "Número total de dominios que enlazan",
            "Calidad de los sitios que enlazan",
            "Diversidad de anchor text",
            "Naturalidad del perfil de enlaces"
          ]
        },
        {
          type: "warning",
          content: "⚠️ Cuidado: Un perfil de backlinks artificial o spammy puede reducir significativamente el valor del dominio."
        },
        {
          type: "heading",
          content: "Valor Comercial",
          level: 1
        },
        {
          type: "paragraph",
          content: "El potencial comercial evalúa qué tan valioso puede ser el dominio para un negocio:"
        },
        {
          type: "list",
          content: "Criterios de valor comercial",
          items: [
            "Relación con industrias de alto valor (finanzas, salud, tecnología)",
            "Potencial de branding y marketing",
            "Facilidad de pronunciación y escritura",
            "Evita confusiones con marcas existentes",
            "Potencial de desarrollo futuro"
          ]
        },
        {
          type: "heading",
          content: "Herramientas de Valoración",
          level: 1
        },
        {
          type: "paragraph",
          content: "Estas herramientas pueden proporcionar estimaciones iniciales, pero siempre requieren análisis humano:"
        },
        {
          type: "list",
          content: "Herramientas recomendadas",
          items: [
            "EstiBot - Valoraciones automatizadas",
            "GoDaddy Domain Appraisal - Evaluaciones gratuitas",
            "Sedo - Datos de mercado y comparables",
            "NameBio - Base de datos de ventas históricas",
            "DomainIQ - Análisis integral de dominios"
          ]
        },
        {
          type: "tip",
          content: "💡 Importante: Ninguna herramienta automática puede reemplazar el análisis experto. Úsalas como punto de partida, no como valoración final."
        },
        {
          type: "heading",
          content: "Conclusión",
          level: 1
        },
        {
          type: "paragraph",
          content: "La valoración de dominios requiere considerar múltiples factores y tener experiencia en el mercado. Comienza con las métricas básicas, pero desarrolla tu intuición analizando muchos casos y siguiendo las tendencias del mercado."
        },
        {
          type: "paragraph",
          content: "Recuerda que el valor final siempre lo determina lo que alguien está dispuesto a pagar. Un dominio puede tener todas las métricas perfectas, pero sin demanda específica, su valor será limitado."
        }
      ],
      relatedGuides: [
        {
          title: "10 Errores Comunes al Comprar Sitios Web",
          url: "/resources/guides/10-errores-comunes-al-comprar-sitios-web",
          readTime: "12 min"
        },
        {
          title: "Fundamentos de SEO para Dominios",
          url: "/resources/guides/fundamentos-de-seo-para-dominios",
          readTime: "8 min"
        },
        {
          title: "Negociación Efectiva en Marketplace Digital",
          url: "/resources/guides/negociacion-efectiva-en-marketplace-digital",
          readTime: "11 min"
        }
      ]
    },
    "10-errores-comunes-al-comprar-sitios-web": {
      title: "10 Errores Comunes al Comprar Sitios Web",
      description: "Evita estos errores costosos al adquirir sitios web con ingresos. Lista de verificación incluida.",
      author: "Ana Rodriguez",
      readTime: "12 min",
      difficulty: "Básico",
      category: "Principiantes",
      views: "1.8K",
      lastUpdated: "2024-01-12",
      tableOfContents: [
        { id: "introduccion", title: "Introducción", level: 1 },
        { id: "error-1", title: "Error #1: No Verificar el Tráfico Real", level: 1 },
        { id: "error-2", title: "Error #2: Ignorar la Fuente de Ingresos", level: 1 },
        { id: "error-3", title: "Error #3: No Revisar el Historial del Dominio", level: 1 },
        { id: "error-4", title: "Error #4: Omitir la Auditoría Técnica", level: 1 },
        { id: "error-5", title: "Error #5: No Evaluar la Competencia", level: 1 },
        { id: "checklist", title: "Lista de Verificación", level: 1 }
      ],
      content: [
        {
          type: "heading",
          content: "Introducción",
          level: 1
        },
        {
          type: "paragraph",
          content: "Comprar un sitio web existente puede ser una excelente inversión, pero también puede convertirse en una pesadilla costosa si no sabes qué buscar. En esta guía, cubrimos los errores más comunes que cometen los compradores novatos."
        },
        {
          type: "heading",
          content: "Error #1: No Verificar el Tráfico Real",
          level: 1
        },
        {
          type: "paragraph",
          content: "Muchos vendedores inflan las cifras de tráfico o muestran capturas de pantalla editadas."
        },
        {
          type: "list",
          content: "Cómo verificar el tráfico real:",
          items: [
            "Solicita acceso a Google Analytics verificado",
            "Usa herramientas de terceros como SimilarWeb",
            "Verifica la consistencia entre diferentes métricas",
            "Analiza la tendencia temporal, no solo números absolutos"
          ]
        },
        {
          type: "warning",
          content: "⚠️ Nunca confíes únicamente en capturas de pantalla. Siempre verifica con acceso directo a las herramientas."
        }
        // ... más contenido
      ],
      relatedGuides: [
        {
          title: "Guía Completa: Cómo Valorar un Dominio Premium",
          url: "/resources/guides/guia-completa-como-valorar-un-dominio-premium",
          readTime: "15 min"
        }
      ]
    }
  };

  useEffect(() => {
    if (slug && guides[slug]) {
      setGuide(guides[slug]);
    }
  }, [slug]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Básico": return "bg-success/10 text-success";
      case "Intermedio": return "bg-warning/10 text-warning";
      case "Avanzado": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const renderContent = (item: any) => {
    switch (item.type) {
      case "heading":
        const HeadingTag = `h${item.level + 1}` as keyof JSX.IntrinsicElements;
        const headingClass = item.level === 1 
          ? "text-2xl font-bold text-foreground mt-8 mb-4" 
          : "text-xl font-semibold text-foreground mt-6 mb-3";
        return (
          <HeadingTag key={item.content} className={headingClass} id={item.content.toLowerCase().replace(/[^a-z0-9]/g, "-")}>
            {item.content}
          </HeadingTag>
        );
      case "paragraph":
        return (
          <p key={item.content} className="text-muted-foreground mb-4 leading-relaxed">
            {item.content}
          </p>
        );
      case "list":
        return (
          <div key={item.content} className="mb-4">
            <ul className="space-y-2 text-muted-foreground">
              {item.items?.map((listItem: string, index: number) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-1 shrink-0" />
                  <span>{listItem}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      case "code":
        return (
          <pre key={item.content} className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
            <code className="text-sm text-foreground">{item.content}</code>
          </pre>
        );
      case "tip":
        return (
          <div key={item.content} className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
            <p className="text-primary text-sm">{item.content}</p>
          </div>
        );
      case "warning":
        return (
          <div key={item.content} className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
            <p className="text-destructive text-sm">{item.content}</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (!guide) {
    return (
      <div className="min-h-screen bg-background py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Guía no encontrada</h1>
          <p className="text-muted-foreground mb-6">La guía que buscas no existe o ha sido movida.</p>
          <Link to="/resources/guides">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Guías
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-background to-secondary/10 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <Link to="/resources/guides" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Guías
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="outline">{guide.category}</Badge>
                <Badge className={getDifficultyColor(guide.difficulty)}>
                  {guide.difficulty}
                </Badge>
              </div>
              
              <h1 className="text-4xl font-black text-foreground mb-4">
                {guide.title}
              </h1>
              
              <p className="text-xl text-muted-foreground mb-6">
                {guide.description}
              </p>
              
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Por {guide.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{guide.readTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{guide.views} lecturas</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Descargar PDF
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Compartir
                    </Button>
                  </div>
                  <Separator className="mb-4" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Última actualización:</span>
                      <span>{new Date(guide.lastUpdated).toLocaleDateString("es-ES")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tiempo de lectura:</span>
                      <span>{guide.readTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nivel:</span>
                      <span>{guide.difficulty}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contenido</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    {guide.tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-sm hover:text-primary transition-colors ${
                          item.level === 2 ? "ml-4 text-muted-foreground" : "text-foreground"
                        }`}
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="prose prose-lg max-w-none">
              {guide.content.map((item, index) => (
                <div key={index}>
                  {renderContent(item)}
                </div>
              ))}
            </div>

            {/* Related Guides */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">Guías Relacionadas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guide.relatedGuides.map((relatedGuide, index) => (
                  <Link key={index} to={relatedGuide.url}>
                    <Card className="hover:shadow-lg transition-all duration-300 group">
                      <CardHeader>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {relatedGuide.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{relatedGuide.readTime}</span>
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideDetail;