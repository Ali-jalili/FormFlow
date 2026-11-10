/** @format */

import { FormProvider, useForm, useWatch } from "react-hook-form";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import FormBuilderHeader from "../components/FormBuilderHeader";
import FormFieldsEditor from "../components/FormFieldsEditor";
import FormPreview from "../components/FormPreview";

function BuilderHarness({ onSave, onPublish }) {
  const methods = useForm({
    defaultValues: { title: "Customer feedback", fields: [] },
  });
  const fields = useWatch({
    control: methods.control,
    name: "fields",
  });
  const title = useWatch({
    control: methods.control,
    name: "title",
  });

  return (
    <FormProvider {...methods}>
      <FormBuilderHeader
      title={title}
        onTitleChange={(title) =>
          methods.setValue("title", title, { shouldDirty: true })
        }
        onBack={vi.fn()}
        onPreviewToggle={vi.fn()}
        showPreview={false}
        onSave={onSave}
        onPublish={onPublish}
        onUnpublish={vi.fn()}
        isSaving={false}
        isPublishing={false}
        isUnpublishing={false}
        isPublished={false}
        isDirty={methods.formState.isDirty}
        canPublish={fields.length > 0}
      />
      <main className="grid grid-cols-2 gap-4">
        <FormFieldsEditor />
        <FormPreview />
      </main>
    </FormProvider>
  );
}

describe("FormBuilder creation flow", () => {
  it("adds a required question, updates the live preview, then saves and publishes", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const onPublish = vi.fn();

    render(<BuilderHarness onSave={onSave} onPublish={onPublish} />);

    expect(screen.getByRole("button", { name: /publish/i })).toBeDisabled();
    expect(screen.getByText("Your form is waiting")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /add a field/i }));
    await user.click(screen.getByRole("menuitem", { name: /short text/i }));
    await user.type(
      screen.getByPlaceholderText("What would you like to ask?"),
      "Your name",
    );
    await user.click(screen.getByRole("checkbox", { name: /required question/i }));

    expect(
      screen.getByText("Your name", { selector: "label" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Your form is waiting")).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText("Short text answer")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /publish/i })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: /^save$/i }));
    await user.click(screen.getByRole("button", { name: /^publish$/i }));

    expect(onSave).toHaveBeenCalledOnce();
    expect(onPublish).toHaveBeenCalledOnce();
  });
});
