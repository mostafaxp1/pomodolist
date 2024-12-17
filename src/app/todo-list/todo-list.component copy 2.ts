import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-todo-list',
  imports: [CommonModule, FormsModule, DragDropModule, MatIconModule],
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
          class="bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-700 aria-labelledby pt-2"
        >
          <mat-icon>add</mat-icon>
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
              <span>{{ task.text }}</span>
              <div class="flex gap-2">
                <button
                  (click)="startTask(i)"
                  class="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 aria-labelledby pt-2"
                  [disabled]="task.isActive"
                  [hidden]="task.isActive"
                >
                  <mat-icon>{{ task.isActive ? 'play_circle_filled' : 'play_arrow' }}</mat-icon>
                </button>
                <button
                  (click)="stopTask(i)"
                  class="bg-yellow-600 text-white px-3 py-1 rounded-lg hover:bg-yellow-700 aria-labelledby pt-2"
                  *ngIf="task.isActive"
                >
                  <mat-icon>pause</mat-icon>

                </button>
                <button
                  (click)="completeTask(i)"
                  class="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 aria-labelledby pt-2"
                >
                  <mat-icon>check_circle</mat-icon>
                </button>
                <button
                  (click)="removeTask(i)"
                  class="text-white bg-red-600 px-3 py-1 rounded-lg hover:bg-red-700 aria-labelledby pt-2"
                >
                  <mat-icon>close</mat-icon>
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
          <span class="text-gray-600 line-through">{{ task.text }}</span>
          <span class="text-sm text-gray-600">{{ formattedTime(task.timeSpent) }}</span>
          <button
            (click)="removeCompletedTask(task)"
            class="text-white bg-red-600 px-3 py-1 rounded-lg hover:bg-red-700 aria-labelledby pt-2"
          >
            <mat-icon>close</mat-icon>
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
        console.log('Reinitializing task', index);
        this.startTask(index); // Restart intervals for active tasks
      }
    });
  }

  formattedTime(time: number): string {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    /* return hours > 0 ? `${String(hours).padStart(2, '0')} hours` : minutes > 0 ? `${String(minutes).padStart(2, '0')} minutes` :
    minutes > 0 ? `${String(minutes).padStart(2, '0')} minutes ${String(seconds).padStart(2, '0')} seconds` :
     `${String(seconds).padStart(2, '0')} seconds`; */
  }
}