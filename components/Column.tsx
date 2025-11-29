import { Task, TaskStatus } from '@/lib/types';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

interface ColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
}

export default function Column({ id, title, tasks, onDeleteTask, onEditTask }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex-1 min-w-[300px] bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg text-gray-700">{title}</h2>
        <span className="bg-gray-200 text-gray-600 text-sm px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      
      <div ref={setNodeRef} className="space-y-3 min-h-[200px]">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDeleteTask}
              onEdit={onEditTask}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}