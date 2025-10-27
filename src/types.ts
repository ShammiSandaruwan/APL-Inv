// src/types.ts

export interface Estate {
  id?: number;
  name: string;
  code: string;
  location: string;
  description?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface Building {
  id?: number;
  name: string;
  code: string;
  estate_id: number;
  building_type: string;
  created_at?: string;
  estates?: Estate;
}

export interface Item {
  id?: number;
  name: string;
  item_code: string;
  building_id: number;
  photos: string[];
  created_at?: string;
  buildings?: Building;
}
