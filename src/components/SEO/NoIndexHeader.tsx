import { useEffect } from 'react';

interface NoIndexHeaderProps {
  title?: string;
  description?: string;
}

const NoIndexHeader = ({ title = "Acceso Restringido", description = "Área privada de administración" }: NoIndexHeaderProps) => {
  useEffect(() => {
    // Set meta tags for no indexing
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow, noarchive, nosnippet';
    document.head.appendChild(metaRobots);

    // Set title
    const originalTitle = document.title;
    document.title = title;

    // Set meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    const originalDescription = metaDescription?.getAttribute('content') || '';
    
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      metaDescription.setAttribute('content', description);
      document.head.appendChild(metaDescription);
    }

    // Add additional security headers via meta
    const metaSecurity = document.createElement('meta');
    metaSecurity.httpEquiv = 'X-Robots-Tag';
    metaSecurity.content = 'noindex, nofollow';
    document.head.appendChild(metaSecurity);

    // Cleanup on unmount
    return () => {
      document.head.removeChild(metaRobots);
      document.head.removeChild(metaSecurity);
      document.title = originalTitle;
      if (metaDescription) {
        metaDescription.setAttribute('content', originalDescription);
      }
    };
  }, [title, description]);

  return null;
};

export default NoIndexHeader;