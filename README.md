# ManCanCleanToo Dashboard

A modern React dashboard for managing users, notifications, feedback, and more. Built with Vite, Tailwind CSS, Ant Design, and React Router.

## Features

- User management dashboard
- Notification system (context-based, real-time updates)
- Feedback dashboard section
- Authentication (Sign In, Password Reset, Verification)
- Responsive layout with sidebar and header
- Ant Design tables, modals, and pagination
- Custom theming (primary color: #013666)
- API-ready structure for notifications and feedback

## Tech Stack

- React
- Vite
- Tailwind CSS
- Ant Design
- React Router
- Context API (for notifications)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

## Project Structure

```
├── public/
├── src/
│   ├── assets/
│   ├── auth/
│   ├── components/
│   │   ├── Dashboard/
│   │   ├── LayoutComponents/
│   ├── context/
│   ├── layout/
│   ├── page/
│   │   ├── Notification/
│   │   ├── Settings/
│   │   ├── UserManagement/
│   ├── routes/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── App.css
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── README.md
```

## Notifications System

- Uses React Context (`NotificationContext.jsx`) for global notification state.
- Fetch notifications from API in `NotificationContext.jsx` using `useEffect`.
- All components (header modal, notification page) use `useNotification()` for real-time updates.

## Feedback Section

- `Feedback.jsx` displays user feedback.
- Ready for API integration: just replace demo data with your API call.

## Customization

- Change primary color in `tailwind.config.js` and Ant Design theme config.
- Add new dashboard sections in `src/components/Dashboard/`.

## API Integration

- Notifications: Fetch in `NotificationContext.jsx` and update context.
- Feedback: Fetch in `Feedback.jsx` and update local state.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

MIT
