declare interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  abilities: Ability[];
  types: Type[];
}
declare interface Image {
  id: string;
  name: string;
  mime_type: string;
}

declare interface Label {
  id: string;
  name: string;
  description: string;
}

declare type OrderByType = 'CREATED_AT' | 'UPDATED_AT';
