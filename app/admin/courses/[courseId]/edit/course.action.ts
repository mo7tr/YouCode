"use server";

import { authActionClient } from "@/lib/action";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { CourseFormSchema } from "./course.schema";

const CourseActionEditSchema = z.object({
  courseId: z.string(),
  data: CourseFormSchema,
});
const CourseActionCreateSchema = z.object({
  data: CourseFormSchema,
});

export const courseActionEdit = authActionClient
  .metadata({ actionName: "editCourse" })
  .schema(CourseActionEditSchema)
  .action(async ({ parsedInput: { courseId, data }, ctx: { userId } }) => {
    const course = await prisma.course.update({
      where: {
        id: courseId,
        creatorId: userId,
      },
      data: data,
    });

    // to keep track in the front if an error occured
    // throw new ActionError("Can't update course");

    return {
      message: "Course updated successfully",
      course,
    };
  });

export const courseActionCreate = authActionClient
  .metadata({ actionName: "createCourse" })
  .schema(CourseActionCreateSchema)
  .action(async ({ parsedInput: { data }, ctx: { userId } }) => {
    const course = await prisma.course.create({
      data: {
        creatorId: userId,
        ...data,
      },
    });

    // to keep track in the front if an error occured
    // throw new ActionError("Can't create course");

    return {
      message: "Course created successfully",
      course,
    };
  });
