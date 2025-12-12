import toast from "react-hot-toast";

class ToastService {
   showErrorToast(message: string) {
      toast.error(message);
   }
}

export const toastService = new ToastService();
