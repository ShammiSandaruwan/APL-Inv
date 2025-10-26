# Estate Asset Management System

This is a web application for managing assets across multiple estates, built as an MVP based on the provided project brief. It allows a Super Admin to manage estates, buildings, and the items within them.

## Features

*   **Authentication:** Secure login for Super Admins.
*   **Estate Management:** Full CRUD (Create, Read, Update, Delete) functionality for estates.
*   **Building Management:** Full CRUD functionality for buildings, with each building linked to an estate.
*   **Item Management:** Full CRUD functionality for items, with each item linked to a building and estate.
*   **Modern UI:** A clean, responsive user interface built with React and Tailwind CSS.

## Tech Stack

*   **Frontend:** Vite, React, TypeScript
*   **Backend & Database:** Supabase (PostgreSQL, Auth, Storage)
*   **Styling:** Tailwind CSS

## Project Setup

### Prerequisites

*   Node.js (v18 or higher)
*   npm
*   A Supabase account

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

1.  Create a new project on [Supabase](https://supabase.com/).
2.  In your Supabase project, go to the **SQL Editor**.
3.  Execute the contents of `mvp_schema.sql` to create the necessary tables.
4.  Execute the contents of `storage_setup.sql` to create the storage bucket for photos.
5.  In your Supabase project, go to **Authentication** and add a new user. This will be your Super Admin account.

### 4. Configure Environment Variables

1.  Create a `.env.local` file in the root of the project.
2.  Add your Supabase project URL and anon key to the file:

    ```
    VITE_SUPABASE_URL=your-supabase-project-url
    VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```

    You can find these in your Supabase project's **API Settings**.

### 5. Run the Application

```bash
npm run dev
```

The application will now be running on `http://localhost:5173`.

## Project Structure

```
.
├── public/
├── src/
│   ├── assets/
│   ├── components/      # Reusable UI components (Button, Card, etc.)
│   ├── layout/          # Layout components (DashboardLayout)
│   ├── lib/             # Supabase client initialization
│   ├── pages/           # Application pages (Estates, Buildings, Items)
│   ├── router/          # Routing components (ProtectedRoute)
│   ├── utils/           # Utility functions (toast notifications)
│   ├── App.tsx          # Main application component with routing
│   ├── index.css        # Tailwind CSS directives
│   └── main.tsx         # Application entry point
├── mvp_schema.sql       # Database schema setup script
├── storage_setup.sql    # Supabase Storage setup script
└── README.md
```
