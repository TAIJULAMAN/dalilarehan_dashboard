import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "user_joined",
      title: "New User Cot",
      description: "Emily Johnson has joined the platform.",
      date: "2025-04-24",
      time: "09:20 AM",
      avatar: "https://avatar.iran.liara.run/public/11",
    },
    {
      id: "2",
      type: "listing_request",
      title: "New Listing Request",
      description:
        'Michael Brown submitted a new listing: "Downtown Event Space"',
      date: "2024-12-14",
      time: "08:00 AM",
      avatar: "https://avatar.iran.liara.run/public/12",
    },
    {
      id: "3",
      type: "listing_request",
      title: "Khaite Jamu",
      description: 'Anna Lee submitted a new listing: "Cozy Book Café"',
      date: "2024-12-14",
      time: "08:00 AM",
      avatar: "https://avatar.iran.liara.run/public/13",
    },
    {
      id: "4",
      type: "listing_request",
      title: "New Listing Request",
      description: 'Anna Lee submitted a new listing: "Cozy Book Café"',
      date: "2024-12-14",
      time: "08:00 AM",
      avatar: "https://avatar.iran.liara.run/public/13",
    },
    {
      id: "5",
      type: "listing_request",
      title: "New Listing Request",
      description: 'Anna Lee submitted a new listing: "Cozy Book Café"',
      date: "2024-12-14",
      time: "08:00 AM",
      avatar: "https://avatar.iran.liara.run/public/13",
    },
    // ...add all other notifications here...
  ]);

  // useEffect(() => {
  //   // Replace with your API call
  //   fetch("/api/notifications")
  //     .then(res => res.json())
  //     .then(data => setNotifications(data));
  // }, []);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
