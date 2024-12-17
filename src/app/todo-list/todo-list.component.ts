import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6 w-full">
      <h3 class="text-lg font-bold mb-4 text-gray-800">To-Do List</h3>

      <!-- Add Task -->
      <div class="flex gap-2 mb-4">
        <input
          type="text"
          [(ngModel)]="newTask"
          placeholder="New Task"
          class="flex-grow border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          (keydown.enter)="addTask()"
        />
        <button
          (click)="addTask()"
          class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Add
        </button>
      </div>

      <!-- Active Tasks -->
      <h4 class="text-md font-semibold text-gray-700 mb-2">Active Tasks</h4>
      <div cdkDropList (cdkDropListDropped)="drop($event)">
        <ul class="space-y-2">
          <li
            *ngFor="let task of activeTasks; let i = index"
            class="flex flex-col bg-gray-100 p-2 rounded-lg"
            cdkDrag
          >
            <div class="flex justify-between items-center">
              <span class="text-lg text-gray-800">{{ task.text }}</span>
              <div class="flex gap-2">
                <button
                  (click)="startTask(i)"
                  class="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                  [disabled]="task.isActive"
                  [hidden]="task.isActive"
                >
                  {{ task.isActive ? 'In Progress' : 'Start' }}
                </button>
                <button
                  (click)="stopTask(i)"
                  class="bg-yellow-600 text-white px-3 py-1 rounded-lg hover:bg-yellow-700"
                  *ngIf="task.isActive"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
                    <path
                      fill-rule="evenodd"
                      d="M5 5a1 1 0 011-1h8a1 1 0 011 1v8a1 1 0 01-1 1H6a1 1 0 01-1-1V5zm1 1v6h6V6H6z"
                      clip-rule="evenodd"
                    />
                    <path fill-rule="evenodd" d="M4 4a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" clip-rule="evenodd" />
                  </svg>
                </button>
                <button
                  (click)="completeTask(i)"
                  class="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 130" fill="currentColor" class="h-5 w-5">
                <path fill-rule="evenodd"  clip-rule="evenodd" fill="#ffffff" d="M0,52.88l22.68-0.3c8.76,5.05,16.6,11.59,23.35,19.86C63.49,43.49,83.55,19.77,105.6,0h17.28 C92.05,34.25,66.89,70.92,46.77,109.76C36.01,86.69,20.96,67.27,0,52.88L0,52.88z"/>
                </svg>
                </button>
                <button
                  (click)="removeTask(i)"
                  class="text-white bg-red-600 px-3 py-1 rounded-lg hover:bg-red-700"
                >
                  X
                </button>
              </div>
            </div>
            <div *ngIf="task.isActive" class="text-sm text-gray-600 mt-2">
              Time Spent: {{ formattedTime(task.timeSpent) }}
            </div>
          </li>
        </ul>
      </div>

      <!-- Completed Tasks -->
      <h4
        *ngIf="completedTasks.length"
        class="text-md font-semibold text-gray-700 mt-4 mb-2"
      >
        Completed Tasks
      </h4>
      <ul class="space-y-2">
        <li
          *ngFor="let task of completedTasks"
          class="flex justify-between items-center bg-green-100 p-2 rounded-lg"
        >
          <span class="text-gray-600 line-through text-xl">{{ task.text }}</span>
          <span class="text-sm text-gray-600">{{ formattedTime(task.timeSpent) }}</span>
          <button
            (click)="removeCompletedTask(task)"
            class="text-white bg-red-600 px-3 py-1 rounded-lg hover:bg-red-700"
          >
            X
          </button>
        </li>
      </ul>
    </div>
  `,
})
export class TodoListComponent implements OnInit {
  newTask = '';
  activeTasks: { text: string; isActive: boolean; timeSpent: number; timerId?: any }[] = [];
  completedTasks: { text: string; timeSpent: number }[] = [];

  ngOnInit(): void {
    this.loadTasksFromLocalStorage();
    this.reinitializeActiveTaskIntervals();
  }

  addTask(): void {
    if (this.newTask.trim()) {
      this.activeTasks.push({ text: this.newTask.trim(), isActive: false, timeSpent: 0 });
      this.newTask = '';
      this.saveTasksToLocalStorage();
    }
  }

  removeTask(index: number): void {
    const task = this.activeTasks[index];
    if (task.isActive) {
      clearInterval(task.timerId);
    }
    this.activeTasks.splice(index, 1);
    this.saveTasksToLocalStorage();
  }

  startTask(index: number): void {
    const task = this.activeTasks[index];
    this.stopTask(index);
    if (!task.isActive) {
      task.isActive = true;
      task.timerId = setInterval(() => {
        task.timeSpent++;
        this.saveTasksToLocalStorage();
      }, 1000);
    }
  }

  stopTask(index: number): void {
    const task = this.activeTasks[index];
    if (task.isActive) {
      clearInterval(task.timerId);
      task.isActive = false;
      this.saveTasksToLocalStorage();
    }
  }

  completeTask(index: number): void {
    const task = this.activeTasks[index];
    if (task.isActive) {
      clearInterval(task.timerId);
      task.isActive = false;
    }
    this.completedTasks.push({ text: task.text, timeSpent: task.timeSpent });
    this.activeTasks.splice(index, 1);
    this.saveTasksToLocalStorage();
  }

  removeCompletedTask(task: { text: string; timeSpent: number }): void {
    const index = this.completedTasks.indexOf(task);
    if (index > -1) {
      this.completedTasks.splice(index, 1);
      this.saveTasksToLocalStorage();
    }
  }

  drop(event: any): void {
    const previousIndex = event.previousIndex;
    const currentIndex = event.currentIndex;
    const item = this.activeTasks.splice(previousIndex, 1)[0];
    this.activeTasks.splice(currentIndex, 0, item);
    this.saveTasksToLocalStorage();
  }

  saveTasksToLocalStorage(): void {
    localStorage.setItem('activeTasks', JSON.stringify(this.activeTasks));
    localStorage.setItem('completedTasks', JSON.stringify(this.completedTasks));
  }

  loadTasksFromLocalStorage(): void {
    const activeTasks = localStorage.getItem('activeTasks');
    const completedTasks = localStorage.getItem('completedTasks');

    if (activeTasks) {
      this.activeTasks = JSON.parse(activeTasks);
    }

    if (completedTasks) {
      this.completedTasks = JSON.parse(completedTasks);
    }
  }

  reinitializeActiveTaskIntervals(): void {
    this.activeTasks.forEach((task, index) => {
      if (task.isActive) {
        this.startTask(index); // Restart intervals for active tasks
      }
    });
  }

  formattedTime(time: number): string {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
}