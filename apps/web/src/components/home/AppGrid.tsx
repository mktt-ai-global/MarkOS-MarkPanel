'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import AppCard, { AppItem } from './AppCard';

interface AppCategory {
  title: string;
  apps: AppItem[];
}

interface AppGridProps {
  initialCategories: AppCategory[];
}

const AppGrid: React.FC<AppGridProps> = ({ initialCategories }) => {
  const [categories, setCategories] = useState(initialCategories);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeId = active.id.toString();
      const overId = over.id.toString();

      // Find which category the active item belongs to
      let activeCategoryIndex = -1;
      let activeItemIndex = -1;

      categories.forEach((cat, catIdx) => {
        const itemIdx = cat.apps.findIndex(app => app.id === activeId);
        if (itemIdx !== -1) {
          activeCategoryIndex = catIdx;
          activeItemIndex = itemIdx;
        }
      });

      // Find which category the over item belongs to
      let overCategoryIndex = -1;
      let overItemIndex = -1;

      categories.forEach((cat, catIdx) => {
        const itemIdx = cat.apps.findIndex(app => app.id === overId);
        if (itemIdx !== -1) {
          overCategoryIndex = catIdx;
          overItemIndex = itemIdx;
        }
      });

      if (activeCategoryIndex !== -1 && overCategoryIndex !== -1) {
        const newCategories = [...categories];

        if (activeCategoryIndex === overCategoryIndex) {
          // Reorder within the same category
          newCategories[activeCategoryIndex].apps = arrayMove(
            newCategories[activeCategoryIndex].apps,
            activeItemIndex,
            overItemIndex
          );
        } else {
          // Move across categories
          const activeItem = newCategories[activeCategoryIndex].apps[activeItemIndex];
          newCategories[activeCategoryIndex].apps.splice(activeItemIndex, 1);
          newCategories[overCategoryIndex].apps.splice(overItemIndex, 0, activeItem);
        }

        setCategories(newCategories);

        // Call Backend API to save new order
        try {
          await fetch('/api/apps/reorder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ categories: newCategories }),
          });
        } catch (error) {
          console.error('Failed to save app order:', error);
        }
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      {categories.map((category) => (
        <div key={category.title} className="mb-[22px]">
          <div className="flex items-center gap-[10px] text-xs font-semibold text-text-muted uppercase tracking-[0.07em] mb-3 after:content-[''] after:flex-1 after:h-[1px] after:bg-black/10">
            {category.title}
          </div>
          <div className="grid grid-cols-1 min-[375px]:grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            <SortableContext
              items={category.apps.map(app => app.id)}
              strategy={rectSortingStrategy}
            >
              {category.apps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </SortableContext>
          </div>
        </div>
      ))}
    </DndContext>
  );
};

export default AppGrid;
