export interface Bot {
  id: string;
  name: string;
  description?: string;
  knowledgeSourceType: 'documents' | 'url';
  documentFiles?: string[];
  websiteUrls?: string[];
  createdAt: string;
  updatedAt: string;

  // Appearance
  primaryColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
  widgetPosition?: 'bottom-right' | 'bottom-left';
  avatarUrl?: string;
  welcomeMessage?: string;
}