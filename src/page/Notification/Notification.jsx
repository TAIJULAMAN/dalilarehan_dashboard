import { RxCross2 } from "react-icons/rx";
import { useEffect, useMemo, useState } from "react";
import { useGetAdminNotificationsQuery } from "../../redux/Api/notificationApi";

const Notification = () => {
  const [list, setList] = useState([]);
  const { data, isLoading } = useGetAdminNotificationsQuery({ page: 1, limit: 20 });

  const items = useMemo(() => {
    const arr = Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data?.data?.notifications)
      ? data.data.notifications
      : Array.isArray(data?.notifications)
      ? data.notifications
      : [];
    return arr.map((n) => {
      const user = n?.relatedData?.userId || {};
      const title = n?.title || "";
      const message = n?.message || "";
      const createdAt = n?.createdAt ? new Date(n.createdAt).toLocaleString() : "";
      const avatar = `https://avatar.iran.liara.run/username?username=${encodeURIComponent(
        user.fullname || user.email || "User"
      )}`;
      return {
        id: n?._id,
        title,
        message,
        avatar,
        createdAt,
        type: n?.type,
      };
    });
  }, [data]);

  useEffect(() => {
    setList(items);
  }, [items]);

  const handleDismiss = (id) => {
    setList((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="py-4 max-h-[86vh] overflow-y-auto mx-5">
      {isLoading && (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={`sk-${i}`} className="p-3 bg-white border rounded-lg shadow-sm animate-pulse">
              <div className="flex gap-10 items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="flex-1">
                  <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-64 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && (list.length > 0 ? (
        list.map((notification) => (
          <div
            key={notification.id}
            className="relative p-3 bg-white border rounded-lg mb-0.5 shadow-sm"
          >
        
            <div className="flex gap-10">
              <img
                src={notification.avatar}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                <p className="text-gray-600 text-sm mt-1">
                  {notification.message}
                </p>
                {notification.createdAt && (
                  <p className="text-gray-400 text-xs mt-1">{notification.createdAt}</p>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-gray-500 text-center">No notifications</div>
      ))}
    </div>
  );
};

export default Notification;
