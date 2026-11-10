/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../Auth/useAuth";
import { saveFormDraft } from "../services/formsService";

function useSaveForm(formId) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) => {
      await saveFormDraft(formId, values.title, values.fields || []);

      return values;
    },

    onSuccess: (values) => {
      queryClient.setQueryData(["forms", user?.id], (old) =>
        old?.map((form) =>
          form.id === formId
            ? {
                ...form,
                title: values.title,
              }
            : form,
        ),
      );

      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: ["forms", user.id],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["form", formId],
      });
      queryClient.invalidateQueries({
        queryKey: ["form_fields", formId],
      });
    },
  });
}

export default useSaveForm;
