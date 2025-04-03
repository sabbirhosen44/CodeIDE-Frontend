import toast from "react-hot-toast";

type ToastType = "success" | "error" | "loading";

export const useToast = () => {
  const showToast = (message: string, type: ToastType) => {
    switch (type) {
      case "success":
        return toast.success(message, { style: { fontWeight: "bold" } });
        break;
      case "error":
        return toast.error(message, { style: { fontWeight: "bold" } });
        break;
      case "loading":
        return toast.loading(message, { style: { fontWeight: "bold" } });
        break;
    }
  };
  return showToast;
};
