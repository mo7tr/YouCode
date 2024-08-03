"use client";

import { cn } from "@/lib/utils";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { toast } from "sonner";
import { AdminLessonItemSortable } from "./AdminLessonItem";
import { saveLessonMove } from "./lessons.action";
import { AdminLessonItemType } from "./lessons.query";

type AdminLessonSortableProps = {
  items: AdminLessonItemType[];
};

export const AdminLessonSortable = ({
  items: defaultItems,
}: AdminLessonSortableProps) => {
  const [items, setItems] = useState(defaultItems);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const router = useRouter();
  const id = useId();

  const mutation = useMutation({
    mutationFn: async ({
      activeId,
      newUpItem,
      newDownItem,
    }: {
      activeId: string;
      newUpItem: string | undefined;
      newDownItem: string | undefined;
    }) => {
      const result = await saveLessonMove({
        data: {
          upItemRank: newUpItem,
          downItemRank: newDownItem,
          lessonId: activeId,
        },
      });

      const { data, serverError, validationErrors } = result || {};

      console.log(9, "result =>", result);
      console.log(9, "data =>", data);
      console.log(9, "serverError =>", serverError);
      console.log(9, "validationErrors =>", validationErrors);

      if (serverError) {
        toast.error("Some error occurred", {
          description: result?.serverError as string,
        });
        return;
      }

      if (validationErrors) {
        toast.error("Some error occurred", {
          description: `Error with ${Object.keys(validationErrors)[0]}`,
        });
        return;
      }

      if (!data) return;

      router.refresh();

      setItems((prevItems) => {
        const activeItem = prevItems.find((item) => item.id === activeId);
        if (!activeItem) return prevItems;

        activeItem.rank = data;

        return [...prevItems];
      });
    },
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) {
      toast.error("Something went wrong");
      return;
    }

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        console.log({ newIndex, newItems });

        const newUpItem = newItems[newIndex - 1]?.rank;
        const newDownItem = newItems[newIndex + 1]?.rank;

        mutation.mutate({
          activeId: String(active.id),
          newUpItem,
          newDownItem,
        });

        return newItems;
      });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      id={id}
    >
      <SortableContext
        disabled={mutation.isPending}
        items={items}
        strategy={verticalListSortingStrategy}
      >
        <div
          className={cn("flex flex-col gap-2", {
            "opacity-50": mutation.isPending,
          })}
        >
          {items.map((lesson, index) => (
            <AdminLessonItemSortable
              index={index}
              key={lesson.id}
              lesson={lesson}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
