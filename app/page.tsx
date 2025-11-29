'use client';

import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverEvent, closestCorners } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import Column from '@/components/Column';
import TaskModal from '@/components/TaskModal';
import { Task, TaskStatus, Column as ColumnType } from '@/lib/types';
import { fetchTasks, createTask, updateTask, deleteTask } from '@/lib/supabase';

export default function Home() {
  const [columns, setColumns] = useState<ColumnType[]>([
    { id: 'TODO', title: 'TODO', tasks: [] },
    { id: 'IN_PROGRESS', title: 'IN PROGRESS', tasks: [] },
    { id: 'DONE', title: 'DONE', tasks: [] },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // タスクを読み込み
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setIsLoading(true);
    const tasks = await fetchTasks();
    
    const newColumns = columns.map(col => ({
      ...col,
      tasks: tasks.filter(task => task.status === col.id),
    }));
    
    setColumns(newColumns);
    setIsLoading(false);
  };

  // タスクを作成・更新
  const handleSaveTask = async (taskData: Partial<Task>) => {
    if (editingTask) {
      // 更新
      const updated = await updateTask(editingTask.id, taskData);
      if (updated) {
        loadTasks();
      }
    } else {
      // 新規作成
      const maxOrder = Math.max(...columns[0].tasks.map(t => t.order), 0);
      const newTask = await createTask({
        ...taskData,
        status: 'TODO',
        order: maxOrder + 1,
      } as Omit<Task, 'id' | 'created_at' | 'updated_at'>);
      
      if (newTask) {
        loadTasks();
      }
    }
    setEditingTask(undefined);
  };

  // タスクを削除
  const handleDeleteTask = async (id: string) => {
    if (confirm('このタスクを削除しますか？')) {
      const success = await deleteTask(id);
      if (success) {
        loadTasks();
      }
    }
  };

  // タスクを編集
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // ドラッグ中
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // カラム間の移動を処理
    const activeColumn = columns.find(col => 
      col.tasks.some(task => task.id === activeId)
    );
    const overColumn = columns.find(col => 
      col.id === overId || col.tasks.some(task => task.id === overId)
    );

    if (!activeColumn || !overColumn || activeColumn === overColumn) return;

    setColumns(cols => {
      const activeTask = activeColumn.tasks.find(t => t.id === activeId)!;
      const newColumns = cols.map(col => {
        if (col.id === activeColumn.id) {
          return {
            ...col,
            tasks: col.tasks.filter(t => t.id !== activeId),
          };
        }
        if (col.id === overColumn.id) {
          return {
            ...col,
            tasks: [...col.tasks, { ...activeTask, status: col.id }],
          };
        }
        return col;
      });
      return newColumns;
    });
  };

  // ドラッグ終了
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = columns.find(col => 
      col.tasks.some(task => task.id === activeId)
    );

    if (!activeColumn) return;

    const oldIndex = activeColumn.tasks.findIndex(t => t.id === activeId);
    const newIndex = activeColumn.tasks.findIndex(t => t.id === overId);

    if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
      const newTasks = arrayMove(activeColumn.tasks, oldIndex, newIndex);
      
      setColumns(cols =>
        cols.map(col =>
          col.id === activeColumn.id ? { ...col, tasks: newTasks } : col
        )
      );

      // 順序を更新
      const task = activeColumn.tasks[oldIndex];
      await updateTask(task.id, { order: newIndex });
    }

    // ステータス変更をDBに保存
    const task = activeColumn.tasks.find(t => t.id === activeId);
    if (task && task.status !== activeColumn.id) {
      await updateTask(task.id, { status: activeColumn.id });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">task ボード</h1>
          <button
            onClick={() => {
              setEditingTask(undefined);
              setIsModalOpen(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            + 新しいタスク
          </button>
        </div>

        <DndContext
          collisionDetection={closestCorners}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 overflow-x-auto pb-4">
            {columns.map((column) => (
              <Column
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={column.tasks}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleEditTask}
              />
            ))}
          </div>
        </DndContext>

        <TaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(undefined);
          }}
          onSave={handleSaveTask}
          task={editingTask}
        />
      </div>
    </div>
  );
}