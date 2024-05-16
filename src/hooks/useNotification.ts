import { useState } from "react";

interface NotificationHook {
  message: string;
  showNotification: (msg: string) => void;
  hideNotification: () => void;
}

const useNotification = (): NotificationHook => {
  const [message, setMessage] = useState("");

  const showNotification = (msg: string) => {
    setMessage(msg);
  };

  const hideNotification = () => {
    setMessage("");
  };

  return { message, showNotification, hideNotification };
};

export default useNotification;
