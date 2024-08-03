"use server";

import { authActionClient } from "@/lib/action";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { LessonDetailSchema } from "./form/Lesson.schema";

const LessonActionEditDetailsSchema = z.object({
  lessonId: z.string(),
  data: LessonDetailSchema,
});

export const lessonActionEditDetails = authActionClient
  .metadata({ actionName: "editLessonDetails" })
  .schema(LessonActionEditDetailsSchema)
  .action(async ({ parsedInput: { lessonId, data }, ctx: { userId } }) => {
    const lesson = await prisma.lesson.update({
      where: {
        id: lessonId,
        course: {
          creatorId: userId,
        },
      },
      data: data,
    });

    // to keep track in the front if an error occured
    // throw new ActionError("Can't update lesson details");

    return {
      message: "Lesson updated successfully",
      lesson,
    };
  });

const LessonActionEditContentSchema = z.object({
  lessonId: z.string(),
  markdown: z.string(),
});

export const lessonActionEditContent = authActionClient
  .metadata({ actionName: "editLessonContent" })
  .schema(LessonActionEditContentSchema)
  .action(async ({ parsedInput: { lessonId, markdown }, ctx: { userId } }) => {
    const lesson = await prisma.lesson.update({
      where: {
        id: lessonId,
        course: {
          creatorId: userId,
        },
      },
      data: {
        content: markdown,
      },
    });

    // to keep track in the front if an error occured
    // throw new ActionError("Can't update lesson content");

    return {
      message: "Lesson updated successfully",
      lesson,
    };
  });
