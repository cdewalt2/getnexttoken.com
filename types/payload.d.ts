
declare module 'payload/types' {
  export interface CollectionConfig {
    slug: string;
    labels?: {
      singular?: string;
      plural?: string;
    };
    fields: any[];
    access?: any;
    admin?: any;
    hooks?: any;
    versions?: any;
    timestamps?: boolean;
  }
}

declare module 'payload/config';
