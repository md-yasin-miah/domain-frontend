import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const GuideCategory = () => {
  const { category } = useParams();
  
  const categoryData: Record<string, any> = {
    "para-principiantes": {
      title: "Guías para Principiantes",
      description: "Fundamentos para empezar en activos digitales",
      color: "bg-primary/10 text-primary",
      guides: [
        {
          title: "Primeros Pasos en ADOMINIOZ",
          description: "Aprende cómo crear tu cuenta, verificar tu identidad y navegar por la plataforma",
          readTime: "8 min",
          difficulty: "Básico",
          author: "Equipo ADOMINIOZ",
          slug: "primeros-pasos-en-adominioz"
        },
        {
          title: "¿Qué son los Activos Digitales?",
          description: "Introducción a dominios, sitios web, apps y otros activos digitales",
          readTime: "12 min",
          difficulty: "Básico",
          author: "Carlos Martinez",
          slug: "que-son-los-activos-digitales"
        },
        {
          title: "Cómo Realizar tu Primera Compra",
          description: "Guía paso a paso para comprar tu primer activo digital de forma segura",
          readTime: "15 min",
          difficulty: "Básico",
          author: "Ana Rodriguez",
          slug: "como-realizar-tu-primera-compra"
        }
      ]
    },
    "valoracion-de-activos": {
      title: "Valoración de Activos",
      description: "Aprende a evaluar dominios, sitios y apps",
      color: "bg-secondary/10 text-secondary",
      guides: [
        {
          title: "Guía Completa: Cómo Valorar un Dominio Premium",
          description: "Aprende los factores clave que determinan el valor de un dominio",
          readTime: "15 min",
          difficulty: "Intermedio",
          author: "Carlos Martinez",
          slug: "guia-completa-como-valorar-un-dominio-premium"
        },
        {
          title: "Métricas Clave para Sitios Web",
          description: "Entiende qué métricas son importantes al evaluar un sitio web",
          readTime: "18 min",
          difficulty: "Intermedio",
          author: "Miguel Torres",
          slug: "metricas-clave-para-sitios-web"
        }
      ]
    }
  };

  const currentCategory = categoryData[category || ""];

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-background py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Categoría no encontrada</h1>
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
    <div className="min-h-screen bg-background py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <Link to="/resources/guides" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Todas las Guías
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-foreground mb-4">
            {currentCategory.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {currentCategory.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentCategory.guides.map((guide: any, index: number) => (
            <Link key={index} to={`/resources/guides/${guide.slug}`}>
              <Card className="hover:shadow-xl transition-all duration-300 group cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={currentCategory.color}>
                      {guide.difficulty}
                    </Badge>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{guide.readTime}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {guide.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {guide.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Por {guide.author}
                    </span>
                    <BookOpen className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuideCategory;