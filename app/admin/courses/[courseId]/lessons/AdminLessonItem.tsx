import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import Link from "next/link";
import { AdminLessonItemType } from "./lessons.query";

export type LessonItemProps = {
  lesson: AdminLessonItemType;
};

export const AdminLessonItem = ({ lesson }: LessonItemProps) => {
  console.log(0, "lesson", lesson);
  return (
    <Link href={`/admin/courses/${lesson.courseId}/lessons/${lesson.id}`}>
      <div className="flex items-center rounded border-2 border-border bg-card px-4 py-2 transition-colors hover:bg-accent">
        <Typography variant="large">{lesson.name}</Typography>
        <Badge className="ml-auto">{lesson.state}</Badge>
      </div>
    </Link>
  );
};
