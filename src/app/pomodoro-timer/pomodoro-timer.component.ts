import { CommonModule } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-pomodoro-timer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full flex-col justify-center flex-1 w-full max-w-lg p-6">
      <div class="relative h-100 w-100" id="timerContainer">
        <canvas id="timerChart" class="w-full h-full"></canvas>
        <div
          class="absolute inset-0 flex flex-col items-center justify-center text-3xl font-bold text-gray-800"
        >
          {{ formattedTime }}
          <div *ngIf="leftTime > totalSeconds" class="text-2xl text-gray-500">{{ formattedoverLeftTime }}</div>
        </div>
      </div>
         
      <div class="mt-6 flex justify-center gap-0">
        <button
          (click)="toggleTimer()"
          [class]="isPaused ? 'bg-blue-600 text-white py-2 px-4 rounded-lg rounded-tr rounded-br hover:bg-blue-700' : 'mr-0 bg-blue-600 text-white py-2 px-4 rounded-lg rounded-tr rounded-br hover:bg-yellow-600'"
        >
          {{ isPaused ? 'Start' : 'Pause' }}
        </button>

        <!-- Dropdown Button -->
        <div class="relative">
          <button
            (click)="toggleDropdown()"
            [class]="(isPaused ? 'hover:bg-blue-700' : 'hover:bg-yellow-600') + ' bg-blue-600 text-white py-2 px-1 rounded-lg hover:bg-blue-700 ml-0 w-6 pt-5 rounded-tl-none rounded-bl-none border-x-solid border-l border-x-stone-100'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 730 730" fill="currentColor" class="h-5 w-5">
              <path fill-rule="nonzero" d="M12.08 70.78c-16.17-16.24-16.09-42.54.15-58.7 16.25-16.17 42.54-16.09 58.71.15L256 197.76 441.06 12.23c16.17-16.24 42.46-16.32 58.71-.15 16.24 16.16 16.32 42.46.15 58.7L285.27 285.96c-16.24 16.17-42.54 16.09-58.7-.15L12.08 70.78z"/>  
            </svg>          

          </button>
          <div
            (click)="stopPropagation($event)"
            (document:click)="toggleDropdown()"
            *ngIf="dropdownOpen"
            class="absolute top-full start-0 left-0 mt-2 bg-white border rounded shadow-lg w-40	"
          >
            <button
              *ngFor="let option of timerOptions"
              (click)="setTimer(option.duration)"
              class="block w-full px-4 py-2 text-left hover:bg-blue-100"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

         <button
          (click)="resetTimer()"
          class="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 ml-2"
        >
          Reset
        </button>
      </div>  
      
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
      }
    `,
  ],
})
export class PomodoroTimerComponent implements AfterViewInit {
  totalSeconds = 25 * 60; // 25 minutes
  remainingSeconds = this.totalSeconds;
  isPaused = true;
  intervalId: ReturnType<typeof setInterval> | undefined;
  leftTime: number = 0;
  overLeftIntervalId: ReturnType<typeof setInterval> | undefined;
  chart!: Chart;
  startTime = 0;
  dropdownOpen = false;
  timerOptions = [
    { label: '5 Minutes', duration: 5 * 60 },
    { label: '15 Minutes', duration: 15 * 60 },
    { label: '25 Minutes', duration: 25 * 60 },
    { label: '1 Hour', duration: 60 * 60 },
  ];

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  ngAfterViewInit(): void {
    this.initializeChart();
  }

  get formattedTime(): string {
    const hours = Math.floor(this.remainingSeconds / 3600);
    const minutes = Math.floor((this.remainingSeconds % 3600) / 60);
    const seconds = this.remainingSeconds % 60;

    return  (hours? `${String(hours).padStart(2, '0')}:` : '') + `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  get formattedoverLeftTime(): string {
    const overLeftTime = this.leftTime - this.totalSeconds;
    const hours = Math.floor(overLeftTime / 3600);
    const minutes = Math.floor((overLeftTime % 3600) / 60);
    const seconds = overLeftTime % 60;

    return '-' + (hours? `${String(hours).padStart(2, '0')}:` : '') + `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  setTimer(duration: number): void {
    this.dropdownOpen = false;
    this.totalSeconds = duration;
    this.remainingSeconds = duration;
    this.updateChart();
    clearInterval(this.intervalId);
    this.isPaused = true;
    this.toggleTimer();
  }

  initializeChart(): void {
    Chart.register(...registerables);

    const ctx = document.getElementById('timerChart') as HTMLCanvasElement;

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Elapsed', 'Remaining'],
        datasets: [
          {
            data: [0, this.totalSeconds],
            backgroundColor: ['#e5e7eb', '#1d4ed8'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: { enabled: false },
          legend: { display: false },
        },
        cutout: '95%',
      },
    });
  }

  updateChart(): void {
    const elapsed = this.totalSeconds - this.remainingSeconds;
    this.chart.data.datasets[0].data = [elapsed, this.remainingSeconds];
    this.chart.update();
  }

  toggleTimer(): void {
    this.startTime = Date.now();
    clearInterval(this.overLeftIntervalId);
    if (this.isPaused) {
      this.isPaused = false;
      if(this.remainingSeconds === 0) {
        this.remainingSeconds = this.totalSeconds;
        this.updateChart();
      }
      this.leftTime = this.totalSeconds - this.remainingSeconds;
      this.intervalId = setInterval(() => {
        if (this.remainingSeconds > 0) {
          this.remainingSeconds = (this.totalSeconds - this.leftTime) - Math.floor((Date.now() - this.startTime) / 1000);
          this.remainingSeconds = this.remainingSeconds < 0 ? 0 : this.remainingSeconds;
          //this.remainingSeconds--;
          this.updateChart();
        }
        if (this.remainingSeconds <= 0) {
          this.isPaused = true;
          clearInterval(this.overLeftIntervalId);
          this.setOverLeftInterval(this.leftTime);
          clearInterval(this.intervalId);
        }
      }, 1000);
    } else {
      clearInterval(this.intervalId);
      this.isPaused = true;
    }
  }

  setOverLeftInterval(currentLeftTime: number): void {
    this.overLeftIntervalId = setInterval(() => {
      this.leftTime = currentLeftTime + Math.floor((Date.now() - this.startTime) / 1000);
    }, 1000);
  }

  resetTimer(): void {
    clearInterval(this.intervalId);
    clearInterval(this.overLeftIntervalId);
    this.startTime = 0;
    this.leftTime = this.totalSeconds;
    this.isPaused = true;
    this.remainingSeconds = this.totalSeconds;
    this.updateChart();
  }
}
