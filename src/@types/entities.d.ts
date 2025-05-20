declare interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  abilities: Ability[];
  types: Type[];
}
declare interface Agent {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
