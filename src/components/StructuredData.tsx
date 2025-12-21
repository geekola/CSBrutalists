import React from 'react';
import { SEOSettings } from '../hooks/useSEO';

interface StructuredDataProps {
  seoSettings: SEOSettings;
  pageType?: 'home' | 'portfolio' | 'resume' | 'contact' | 'project';
  projectData?: {
    title: string;
    description?: string;
    category: string;
    year: string;
    imageUrl?: string;
  };
}

const StructuredData: React.FC<StructuredDataProps> = ({
  seoSettings,
  pageType = 'home',
  projectData
}) => {
  const baseUrl = window.location.origin;

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': seoSettings.business_type || 'ProfessionalService',
    'name': seoSettings.business_name,
    'description': seoSettings.meta_description,
    'url': baseUrl,
    'telephone': seoSettings.phone,
    'email': seoSettings.email,
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': seoSettings.location_city,
      'addressRegion': seoSettings.location_state,
      'addressCountry': seoSettings.location_country
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': seoSettings.latitude,
      'longitude': seoSettings.longitude
    },
    'areaServed': seoSettings.service_areas?.split(',').map(area => ({
      '@type': 'City',
      'name': area.trim()
    })),
    'priceRange': '$$',
    'serviceType': [
      'Brand Strategy',
      'AR/AI Product Development',
      'Digital Media Consulting',
      'Business Development',
      'Integrated Brand Strategy',
      'Audience Engagement'
    ]
  };

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': seoSettings.author_name,
    'jobTitle': 'Brand Strategist & Innovation Leader',
    'description': 'Entrepreneurial leader with 20+ years of experience in Brand Management, Business Development, and Media, pioneering AR/AI SaaS and audience engagement strategies.',
    'url': baseUrl,
    'email': seoSettings.email,
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': seoSettings.location_city,
      'addressRegion': seoSettings.location_state,
      'addressCountry': seoSettings.location_country
    },
    'worksFor': {
      '@type': 'Organization',
      'name': seoSettings.business_name
    },
    'knowsAbout': [
      'Brand Strategy',
      'Augmented Reality',
      'Artificial Intelligence',
      'Digital Media',
      'Business Development',
      'Product Development',
      'Audience Engagement',
      'B2B Client Acquisition'
    ],
    'alumniOf': {
      '@type': 'EducationalOrganization',
      'name': 'Wilmington University'
    }
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': seoSettings.site_title,
    'description': seoSettings.meta_description,
    'url': baseUrl,
    'author': {
      '@type': 'Person',
      'name': seoSettings.author_name
    }
  };

  const breadcrumbSchema = pageType !== 'home' ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': baseUrl
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': pageType.charAt(0).toUpperCase() + pageType.slice(1),
        'item': `${baseUrl}#${pageType}`
      }
    ]
  } : null;

  const projectSchema = projectData ? {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    'name': projectData.title,
    'description': projectData.description || `${projectData.category} project completed in ${projectData.year}`,
    'creator': {
      '@type': 'Person',
      'name': seoSettings.author_name
    },
    'dateCreated': projectData.year,
    'genre': projectData.category,
    ...(projectData.imageUrl && {
      'image': {
        '@type': 'ImageObject',
        'url': projectData.imageUrl
      }
    })
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {projectSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
        />
      )}
    </>
  );
};

export default StructuredData;
