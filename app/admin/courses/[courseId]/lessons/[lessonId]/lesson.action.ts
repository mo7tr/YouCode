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
  .metadata({ actionName: "editLesson" })
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
    // throw new ActionError("Can't update course");

    return {
      message: "Lesson updated successfully",
      lesson,
    };
  });
