"use server";

import { authActionClient } from "@/lib/action";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const handleLessonStateSchema = z.object({
  data: z.object({
    lessonId: z.string(),
    progress: z.enum(["COMPLETED", "IN_PROGRESS"]),
  }),
});

export const handleLessonState = authActionClient
  .metadata({ actionName: "handleLessonState" })
  .schema(handleLessonStateSchema)
  .action(
    async ({
      parsedInput: {
        data: { lessonId, progress },
      },
      ctx: { userId },
    }) => {
      const updatedLessonOnUser = await prisma.lessonOnUser.update({
        where: {
          userId_lessonId: { lessonId, userId },
        },
        data: { progress },
        select: {
          lesson: {
            select: {
              rank: true,
              courseId: true,
              id: true,
            },
          },
        },
      });

      const nextLesson = await prisma.lesson.findFirst({
        where: {
          courseId: updatedLessonOnUser.lesson.courseId,
          rank: { gt: updatedLessonOnUser.lesson.rank },
          state: { not: "HIDDEN" },
        },
        orderBy: { rank: "asc" },
      });

      revalidatePath(
        `/courses/${updatedLessonOnUser.lesson.courseId}/lessons/${lessonId}`
      );

      if (!nextLesson) {
        return;
      }

      redirect(
        `/courses/${updatedLessonOnUser.lesson.courseId}/lessons/${nextLesson.id}`
      );
    }
  );
