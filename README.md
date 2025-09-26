# User Management System

A full-stack user management application built with React TypeScript frontend and Node.js/Express backend with MongoDB database.

## Features

### ✅ Core Requirements (100% Complete)

1. **User List Display (40%)** - ✅ Complete
   - Display users with name, gender, birthday, occupation, and phone number
   - Image upload functionality with default person image fallback
   - Professional card-based layout

2. **Occupation Dropdown (10%)** - ✅ Complete
   - Dropdown menu with options: Student, Engineer, Teacher, Unemployed

3. **Card View with Pagination (10%)** - ✅ Complete
   - Displays 6 users per page
   - Pagination controls for navigation
   - Grid layout matching Figure 1 design

4. **Table View (10%)** - ✅ Complete
   - Switchable tab between card and table views
   - Table layout without images
   - Paginated display (6 users per page)

5. **Add User Functionality (10%)** - ✅ Complete
   - Add button opens modal window
   - Form validation and error handling
   - All fields from requirement 1

6. **Edit/Delete Users (10%)** - ✅ Complete
   - Edit button opens populated modal
   - Delete functionality with confirmation
   - Full CRUD operations

7. **Debounced Search (10%)** - ✅ Complete
   - Search by name, occupation, or phone number
   - 500ms debounce delay for performance
   - Real-time filtering

8. **Data Persistence (10%)** - ✅ Complete
   - MongoDB database storage
   - Data persists after browser refresh/restart
   - Automatic data synchronization

### 🚀 Additional Features

- **Responsive Design**: Mobile-friendly layout
- **Error Handling**: Comprehensive error management
- **Image Upload**: File upload with validation
- **Form Validation**: Client-side validation with error messages
- **Loading States**: User feedback during API calls
- **Professional UI**: Modern, clean interface design

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **CSS3** with responsive design
- **Axios** for API calls
- **Custom hooks** for debouncing

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **Multer** for file uploads
- **CORS** for cross-origin requests

## Project Structure

```
pegatron_project/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API service layer
│   │   ├── types/          # TypeScript type definitions
│   │   ├── hooks/          # Custom React hooks
│   │   └── App.tsx         # Main application component
│   └── public/
│       └── default-person.png
├── backend/                 # Node.js Express backend
│   ├── src/
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API route handlers
│   │   └── index.ts        # Server entry point
│   └── uploads/            # File upload directory
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd pegatron_project
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run build
npm run dev
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

The frontend will start on `http://localhost:3000`

### 4. MongoDB Setup
- **Local MongoDB**: Start MongoDB service on default port 27017
- **MongoDB Atlas**: Update connection string in `backend/src/index.ts`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get paginated users with optional search |
| GET | `/api/users/:id` | Get single user by ID |
| POST | `/api/users` | Create new user with optional image |
| PUT | `/api/users/:id` | Update user by ID |
| DELETE | `/api/users/:id` | Delete user by ID |

## Usage

1. **View Users**: Switch between card and table views using the toggle buttons
2. **Add User**: Click "Add User" button to open the creation modal
3. **Edit User**: Click "Edit" button on any user card/row
4. **Delete User**: Click "Delete" button (requires confirmation)
5. **Search Users**: Type in the search box to filter users
6. **Navigate**: Use pagination controls to browse through users
7. **Upload Images**: Select image files when adding/editing users

## Development

### Frontend Development
```bash
cd frontend
npm start
```

### Backend Development
```bash
cd backend
npm run dev
```

### Build for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
npm start
```

## Error Handling

- Network connection errors
- File upload validation
- Form input validation
- Database operation errors
- User-friendly error messages

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request# User Management Project
