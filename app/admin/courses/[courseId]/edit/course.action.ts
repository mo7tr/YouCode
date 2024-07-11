"use server";

import { authActionClient } from "@/lib/action";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { CourseFormSchema } from "./course.schema";

const CourseActionEditSchema = z.object({
  courseId: z.string(),
  data: CourseFormSchema,
});

export const courseActionEdit = authActionClient
  .metadata({ actionName: "editCourse" })
  .schema(CourseActionEditSchema)
  .action(async ({ parsedInput: { courseId, data }, ctx: { userId } }) => {
    await prisma.course.update({
      where: {
        id: courseId,
        creatorId: userId,
      },
      data: data,
    });

    // to keep track in the front if an error occured
    // throw new ActionError("Course not found");

    return "Course updated successfully";
  });
