# TicketHawk Frontend

A React-based web application for tracking ticket prices and getting instant alerts when prices drop.

## Features

- **User Authentication**: Secure login and registration system
- **Price Alerts**: Create and manage price alerts for favorite artists and events
- **Real-time Notifications**: WebSocket-powered instant notifications
- **Event Discovery**: Browse and search events with advanced filtering
- **Subscription Management**: Flexible subscription plans with different features
- **Referral Program**: Earn rewards by referring friends
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between light and dark modes
- **Settings Management**: Comprehensive user preferences and notification settings

## Tech Stack

- **Framework**: React 18
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **WebSocket**: Socket.IO Client
- **Styling**: CSS3 with CSS Variables
- **Build Tool**: Create React App

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Backend API server running (see backend documentation)

### Installation

1. Clone the repository and navigate to the frontend directory:
```bash
cd tickethawk_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_SOCKET_URL=ws://localhost:8000
REACT_APP_SITE_URL=http://localhost:3000
```

### Development

Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

### Building for Production

Create an optimized production build:
```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

### Testing

Run the test suite:
```bash
npm test
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navigation.js    # Main navigation component
│   └── Navigation.css   # Navigation styles
├── context/            # React Context providers
│   ├── AuthContext.js  # Authentication state management
│   ├── ThemeContext.js # Theme state management
│   └── NotificationContext.js # Real-time notifications
├── pages/              # Page components
│   ├── Dashboard.js    # Main dashboard
│   ├── Login.js        # User login
│   ├── Register.js     # User registration
│   ├── Alerts.js       # Price alerts management
│   ├── Events.js       # Event browsing and search
│   ├── Subscriptions.js # Subscription management
│   ├── Notifications.js # Notification history
│   ├── Referrals.js    # Referral program
│   ├── Settings.js     # User settings
│   └── *.css          # Page-specific styles
├── App.js              # Main application component
├── App.css             # Global styles and theme variables
├── index.js            # Application entry point
└── index.css           # Base styles
```

## Key Features

### Authentication System
- JWT-based authentication
- Secure login/logout functionality
- Password change capabilities
- User profile management

### Price Alerts
- Create alerts for specific events and price thresholds
- Real-time price monitoring
- Email, SMS, and push notification options
- Alert history and management

### Real-time Notifications
- WebSocket connection for instant updates
- Multiple notification types (price drops, event updates)
- Notification history and management
- Browser push notification support

### Responsive Design
- Mobile-first design approach
- Responsive grid layouts
- Touch-friendly interface
- Cross-browser compatibility

### Theme System
- Light and dark theme support
- CSS custom properties for easy theming
- Automatic theme persistence
- System preference detection

## API Integration

The frontend communicates with the backend API using:

- **REST API**: For standard CRUD operations
- **WebSocket**: For real-time notifications
- **Authentication**: Bearer token authentication

### API Endpoints Used

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/alerts` - Get user alerts
- `POST /api/alerts` - Create new alert
- `GET /api/events` - Browse events
- `GET /api/notifications` - Get notifications
- `WebSocket /` - Real-time updates

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:8000` |
| `REACT_APP_SOCKET_URL` | WebSocket server URL | `ws://localhost:8000` |
| `REACT_APP_SITE_URL` | Frontend site URL | `http://localhost:3000` |

## Performance Optimizations

- Lazy loading of routes and components
- Optimized bundle splitting
- CSS optimization and minification
- Image optimization
- Efficient state management

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

1. Follow the existing code style and patterns
2. Use meaningful component and variable names
3. Add comments for complex logic
4. Ensure responsive design for all new features
5. Test across different browsers and devices

## Deployment

The application can be deployed to various platforms:

- **Netlify**: Connect your repository for automatic deployments
- **Vercel**: Zero-configuration React deployments
- **AWS S3 + CloudFront**: For scalable static hosting
- **Traditional hosting**: Upload the `build/` folder contents

### Build Environment Variables

Make sure to set the production environment variables:
```bash
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_SOCKET_URL=wss://api.yourdomain.com
REACT_APP_SITE_URL=https://yourdomain.com
```

## License

This project is licensed under the MIT License.
