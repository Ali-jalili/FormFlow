/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../Auth/useAuth";
import { unpublishForm } from "../services/formsService";

function useUnpublishForm(formId) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => unpublishForm(formId),

    onSuccess: () => {
      queryClient.setQueryData(["forms", user.id], (old) =>
        old?.map((form) =>
          form.id === formId
            ? {
                ...form,
                is_published: false,
              }
            : form,
        ),
      );

      queryClient.setQueryData(["form", formId], (old) =>
        old
          ? {
              ...old,
              is_published: false,
            }
          : old,
      );

      queryClient.invalidateQueries({
        queryKey: ["forms", user.id],
      });
    },
  });
}

export default useUnpublishForm;
