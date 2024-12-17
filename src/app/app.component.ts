import { Component } from '@angular/core';
import { PomodoroTimerComponent } from './pomodoro-timer/pomodoro-timer.component';
import { TodoListComponent } from './todo-list/todo-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PomodoroTimerComponent, TodoListComponent],
  template: `
   <div class="flex flex-col h-screen bg-gray-50">
      <!-- Header -->
      <header class="text-blue-600 text-center py-4">
        <h1 class="text-3xl font-bold">PomodoList</h1>
      </header>

      <!-- Main Content -->
      <div class="flex flex-col items-center min-h-screen bg-gray-100 p-6">
        <div class="flex flex-col md:flex-row gap-6 w-9/12">
          <div class="flex flex-col gap-6 w-4/12">
            <app-todo-list></app-todo-list>
          </div>
          <div class="flex flex-col gap-6 w-6/12">
            <app-pomodoro-timer></app-pomodoro-timer>
          </div>
        </div>
      </div>
   </div>
  `,
})
export class AppComponent {}
