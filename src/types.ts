// src/types.ts

// The base for most of our tables
export interface BaseRecord {
  id: string; // UUIDs are strings
  created_at: string;
}

export interface Estate extends BaseRecord {
  name: string;
  code: string;
  location: string;
  description?: string;
  is_active: boolean;
}

export interface Building extends BaseRecord {
  name: string;
  code: string;
  estate_id: string; // Foreign key
  building_type: string;
  occupied_by?: string;
  occupant_designation?: string;
  occupancy_start_date?: string;
  estates?: Estate; // For nested queries
}

export interface Category extends BaseRecord {
  name: string;
  code: string;
  description?: string;
}

export interface Item extends BaseRecord {
  name: string;
  item_code: string;
  estate_id: string; // Foreign key
  building_id: string; // Foreign key
  category_id?: string; // Foreign key
  photos?: string[];
  purchase_date?: string;
  purchase_price?: number;
  current_value?: number;
  status?: string;
  buildings?: Building; // For nested queries
}

export interface UserProfile extends BaseRecord {
  full_name: string;
  role: 'super_admin' | 'co_admin' | 'estate_user';
  is_active: boolean;
}

export interface CoAdminPermissions {
  user_id: string; // Foreign key
  can_create_items: boolean;
  can_edit_items: boolean;
  can_delete_items: boolean;
  can_manage_estates: boolean;
  can_manage_buildings: boolean;
  can_manage_categories: boolean;
  can_generate_reports: boolean;
  can_view_audit_logs: boolean;
}
