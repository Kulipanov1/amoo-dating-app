import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Amoo - Социальная сеть для общения',
  description = 'Amoo - современная социальная сеть для общения, обмена фотографиями и новостями',
  keywords = 'социальная сеть, общение, фотографии, новости, друзья',
  image = '/logo.png',
  url = window.location.href,
  type = 'website'
}) => {
  useEffect(() => {
    // Обновляем заголовок страницы
    document.title = title;
  }, [title]);

  return (
    <Helmet>
      {/* Основные мета-теги */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph мета-теги */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      
      {/* Twitter Card мета-теги */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Дополнительные мета-теги */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#1976d2" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO; 