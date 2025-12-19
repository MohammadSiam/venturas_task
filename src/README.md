# Murmur - Twitter-like Social Platform

A React-based social media application similar to Twitter, built with TypeScript and Tailwind CSS.

## Features

### ✅ Implemented Features

#### Timeline

- **Murmur Feed**: Displays murmurs from followed users and own murmurs
- **Like System**: Users can like/unlike murmurs with heart button
- **Pagination**: Shows 10 murmurs per page with navigation controls
- **Post Creation**: Users can create new murmurs (280 character limit)

#### Murmur Detail

- **Individual Murmur View**: Detailed view of a single murmur
- **Murmur Stats**: Shows creation date, like count, and author info
- **Interactive Actions**: Like and delete functionality

#### User Profiles

- **Own Profile**: View personal murmurs with delete functionality
- **Other User Profiles**: View other users' murmurs and follow/unfollow
- **User Stats**: Display following count, followers count, and murmur count
- **Follow System**: Follow/unfollow other users

#### Navigation

- **Responsive Layout**: Clean, Twitter-like interface
- **User Switcher**: Demo feature to switch between different users
- **Routing**: Seamless navigation between timeline, profiles, and murmur details

## Technical Stack

- **React 19** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Vite** for development and building
- **Context API** for state management

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with navigation
│   ├── MurmurCard.tsx  # Individual murmur display
│   ├── MurmurForm.tsx  # New murmur creation form
│   └── Pagination.tsx  # Pagination controls
├── pages/              # Main page components
│   ├── Timeline.tsx    # Home timeline feed
│   ├── MurmurDetail.tsx # Individual murmur page
│   └── UserProfile.tsx # User profile pages
├── context/            # React Context for state management
│   └── AppContext.tsx  # Main application context
├── hooks/              # Custom React hooks
│   └── useApp.ts       # Hook to access app context
├── data/               # Mock data
│   └── mockData.ts     # Initial users and murmurs
├── types/              # TypeScript type definitions
│   └── index.ts        # User and Murmur interfaces
└── App.tsx             # Main application component
```

## Demo Users

The application comes with 3 demo users:

- **John Doe** (@johndoe)
- **Jane Smith** (@janesmith)
- **Bob Johnson** (@bobjohnson)

Use the user switcher in the navigation to test different user perspectives.

## Future Enhancements

- User authentication system
- Real-time updates
- Image/media support in murmurs
- Search functionality
- Notifications system
- Direct messaging
- Hashtag support
- User mentions (@username)
