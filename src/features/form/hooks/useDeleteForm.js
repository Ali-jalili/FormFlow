import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import useAuth from "../../Auth/useAuth";
import { deleteForm } from "../services/formsService";

function useDeleteForm(formId) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteForm(formId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms", user.id] });
      toast.success("Form deleted successfully!");
    },
    onError: () => toast.error("Failed to delete form."),
  });
}

export default useDeleteForm;
