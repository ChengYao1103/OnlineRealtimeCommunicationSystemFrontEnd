import { toast } from "react-toastify";

const showSuccessNotification = (message: string) => {
  toast.success(message);
};

const showErrorNotification = (error: string) => {
  toast.error(error);
};

const showInfoNotification = (info: JSX.Element | string) => {
  toast.info(info);
};

export { showSuccessNotification, showErrorNotification, showInfoNotification };
