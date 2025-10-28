// src/types.ts

export interface Estate {
  id?: string;
  name: string;
  code: string;
  location: string;
  description?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface Building {
  id?: string;
  name: string;
  code: string;
  estate_id: string;
  building_type: string;
  created_at?: string;
  estates?: Estate;
  occupied_by?: string;
  occupant_designation?: string;
  occupancy_start_date?: string;
}

export interface Item {
  id?: string;
  name: string;
  item_code: string;
  estate_id: string;
  building_id: string;
  photos: string[];
  created_at?: string;
  buildings?: Building;
}
