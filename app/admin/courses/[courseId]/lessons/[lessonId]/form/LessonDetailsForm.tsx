"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useZodForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { lessonActionEditDetails } from "../lesson.action";
import { LESSON_STATE, LessonDetailSchema } from "./Lesson.schema";

export type LessonDetailFormProps = {
  defaultValue: LessonDetailSchema & {
    id: string;
  };
};

export const LessonDetail = ({ defaultValue }: LessonDetailFormProps) => {
  const form = useZodForm({
    schema: LessonDetailSchema,
    defaultValues: defaultValue,
  });
  const router = useRouter();

  return (
    <Form
      form={form}
      className="flex flex-col gap-4"
      onSubmit={async (values) => {
        console.log("Updating/Creating lesson...");

        const result = await lessonActionEditDetails({
          lessonId: defaultValue.id,
          data: values,
        });

        const { data, serverError, validationErrors } = result || {};

        if (data) {
          toast.success(data.message);
          router.refresh();
          return;
        }

        if (validationErrors) {
          toast.error("Some error occurred", {
            description: `Error with ${Object.keys(validationErrors)[0]}`,
          });
          return;
        }

        toast.error("Some error occurred", {
          description: serverError,
        });
        return;
      }}
    >
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="NextReact" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="state"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {LESSON_STATE.map((state) => (
                  <SelectItem key={state} value={state} className="capitalize ">
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit">Submit</Button>
    </Form>
  );
};
