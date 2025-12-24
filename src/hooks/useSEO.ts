import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface SEOSettings {
  id?: string;
  site_title: string;
  site_tagline: string;
  meta_description: string;
  meta_keywords: string;
  author_name: string;
  business_name: string;
  business_type: string;
  location_city: string;
  location_state: string;
  location_country: string;
  service_areas: string;
  phone?: string;
  email?: string;
  latitude: number;
  longitude: number;
  og_image?: string;
  og_type: string;
  twitter_handle?: string;
  google_analytics_id?: string;
}

export interface PageSEO {
  page_key: string;
  title: string;
  meta_description: string;
  keywords?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
}

export const useSEO = () => {
  const [seoSettings, setSeoSettings] = useState<SEOSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSEOSettings();
  }, []);

  const loadSEOSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error loading SEO settings:', error);
        throw error;
      }

      if (data) {
        setSeoSettings(data);
      } else {
        // No settings found - this is expected on first load
        console.log('No SEO settings found in database yet');
        setSeoSettings(null);
      }
    } catch (error) {
      console.error('Failed to load SEO settings:', error);
      setSeoSettings(null);
    } finally {
      setLoading(false);
    }
  };

  const getPageSEO = async (pageKey: string): Promise<PageSEO | null> => {
    try {
      const { data, error } = await supabase
        .from('page_seo')
        .select('*')
        .eq('page_key', pageKey)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error loading page SEO:', error);
      return null;
    }
  };

  const updateSEOSettings = async (settings: Partial<SEOSettings>) => {
    try {
      // If we have an existing ID, update that specific record
      if (seoSettings?.id) {
        const { error } = await supabase
          .from('seo_settings')
          .update(settings)
          .eq('id', seoSettings.id);

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
      } else {
        // If no record exists, insert a new one
        const { error } = await supabase
          .from('seo_settings')
          .insert([settings]);

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
      }

      await loadSEOSettings();
      return true;
    } catch (error) {
      console.error('Error updating SEO settings:', error);
      return false;
    }
  };

  const updatePageSEO = async (pageKey: string, seoData: Partial<PageSEO>) => {
    try {
      const { error } = await supabase
        .from('page_seo')
        .upsert({ page_key: pageKey, ...seoData })
        .eq('page_key', pageKey);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating page SEO:', error);
      return false;
    }
  };

  return {
    seoSettings,
    loading,
    getPageSEO,
    updateSEOSettings,
    updatePageSEO,
    reloadSettings: loadSEOSettings
  };
};

export const updateMetaTags = (data: {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  canonicalUrl?: string;
}) => {
  if (data.title) {
    document.title = data.title;
  }

  const setMetaTag = (name: string, content: string, isProperty = false) => {
    const attribute = isProperty ? 'property' : 'name';
    let element = document.querySelector(`meta[${attribute}="${name}"]`);

    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      document.head.appendChild(element);
    }

    element.setAttribute('content', content);
  };

  if (data.description) {
    setMetaTag('description', data.description);
  }

  if (data.keywords) {
    setMetaTag('keywords', data.keywords);
  }

  if (data.ogTitle) {
    setMetaTag('og:title', data.ogTitle, true);
  }

  if (data.ogDescription) {
    setMetaTag('og:description', data.ogDescription, true);
  }

  if (data.ogImage) {
    setMetaTag('og:image', data.ogImage, true);
  }

  if (data.ogType) {
    setMetaTag('og:type', data.ogType, true);
  }

  if (data.twitterCard) {
    setMetaTag('twitter:card', data.twitterCard);
  }

  if (data.canonicalUrl) {
    let linkElement = document.querySelector('link[rel="canonical"]');
    if (!linkElement) {
      linkElement = document.createElement('link');
      linkElement.setAttribute('rel', 'canonical');
      document.head.appendChild(linkElement);
    }
    linkElement.setAttribute('href', data.canonicalUrl);
  }
};
