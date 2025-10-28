# Estate Asset Management System

This is a comprehensive, production-ready Estate Asset Management System to digitalize and manage estates with their buildings, furniture, equipment, and inventory.

## 🚀 Quick Start

To get the application running locally, follow these steps:

### Prerequisites

-   Node.js (v18 or later)
-   npm (v9 or later)
-   A Supabase account

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1.  **Create a new Supabase project.**
2.  Navigate to the **SQL Editor** in your Supabase project dashboard.
3.  Execute the following SQL scripts from the `supabase/` directory in this order:
    1.  `mvp_schema.sql` - Sets up the initial tables for estates, buildings, and items.
    2.  `storage_setup.sql` - Configures the public bucket for image storage.
    3.  `audit_log_schema.sql` - Creates the audit trail table and triggers.
    4.  `user_roles_schema.sql` - Adds user profile management and role-based security.
    5.  `secure_get_my_role.sql` - Adds a security function to prevent infinite recursion in RLS policies.
    6. `make_bucket_public.sql` - Makes the storage bucket public.
4.  Navigate to **Authentication -> Users** and create a new user. This will be your initial "Super Admin" account.
5.  Navigate to **Project Settings -> API**. You will need the **Project URL** and the **`anon` public API Key**.

### 4. Configure Environment Variables

1.  Create a file named `.env.local` in the root of the project.
2.  Add your Supabase credentials to the file:

    ```
    VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
    ```

### 5. Run the Development Server

```bash
npm run dev
```

The application should now be running at `http://localhost:5173`.

## ✨ Features

-   **Dashboard**: At-a-glance overview of all assets, recent activity, and quick actions.
-   **CRUD Operations**: Full Create, Read, Update, and Delete functionality for:
    -   Estates
    -   Buildings
    -   Items (Assets)
    -   Categories
-   **Role-Based Access Control**:
    -   **Super Admin**: Full system control.
    -   **Co-Admin**: Customizable, estate-restricted access.
    -   **Estate User**: Limited to a single assigned estate.
-   **Photo Management**: Upload multiple images for each item via a drag-and-drop interface.
-   **Advanced Data Management**:
    -   Filtering
    -   Sorting
    -   Searching
-   **Reporting**: Export filtered data to CSV.
-   **Audit Trail**: Comprehensive logging of all system activities for accountability.
-   **Secure**: Built on Supabase with Row Level Security (RLS) to protect data at the database level.

## 🛠️ Tech Stack

-   **Frontend**: Vite, React, TypeScript
-   **Styling**: Tailwind CSS
-   **Backend & Database**: Supabase (PostgreSQL, Auth, Storage)
-   **Deployment**: Vercel (Frontend), Supabase (Backend)

## 🎨 UI Components

A reusable component library was built to maintain a consistent look and feel, including:
-   `Button`
-   `Input`
-   `Card`
-   `Modal`
-   `Table`
-   `Spinner`
-   `Toast` notifications

## 🔐 Security

-   **Authentication**: Managed by Supabase Auth.
-   **Authorization**: Enforced by PostgreSQL's Row Level Security (RLS). All data access is restricted based on the user's role and permissions, ensuring users can only see the data they are authorized to access.
-   **User Management**: User creation is handled through the Supabase dashboard to maintain a secure invitation process.

## 📝 Future Enhancements

-   Item Transfers between buildings.
-   Advanced reporting with PDF and Excel exports.
-   Analytics dashboard with data visualizations.
-   In-app user invitations via a secure server-side function.
