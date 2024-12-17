# PomodoList

**PomodoList** is an elegant and distraction-free productivity app that combines a **Pomodoro Timer** with a **Task Management System**. Designed to always run in your second screen / disktop, PomodoList helps you stay focused, manage tasks efficiently, and track your progress effortlessly.

---

## 🌟 Features

### ✅ Simple Task Management  
- Add, delete, and mark tasks as completed.  
- Track time spent on each task.  
- Drag and drop tasks to reorder priorities.

### ⏳ Flexible Pomodoro Timer  
- Start timers with **custom durations**:
  - **25 Minutes** (default focus session)
  - **15 Minutes** (short focus session)
  - **1 Hour** (long focus session)  
- Visualize progress using a dynamic **doughnut chart** with real-time updates.

### 💾 Task Persistence  
- Automatically saves tasks, their state, and timers in **localStorage**.  
- Active tasks resume their timers automatically when the app is reopened.

### 🎯 Elegant UI Design  
- Clean and modern interface powered by:
  - **Angular Material** for intuitive buttons and icons.
  - **TailwindCSS** for responsive and minimalist styling.

### 🖱️ Drag-and-Drop Reordering  
- Use **Angular CDK** to reorder tasks seamlessly.

---

## 🖥️ Technologies Used

| Technology           | Description                           |
|-----------------------|---------------------------------------|
| **Angular 16+**       | Frontend framework                   |
| **Angular Material**  | UI components and icons              |
| **TailwindCSS**       | Modern utility-first CSS framework   |
| **Angular CDK**       | Drag-and-drop functionality          |
| **Chart.js**          | Doughnut chart visualization         |
| **LocalStorage**      | Task and state persistence           |

---

## 🚀 How to Run the Project

Follow these steps to set up **PomodoList** on your local machine:

### 1. Clone the Repository  
```bash
git clone https://github.com/mostafaxp1/pomodolist.git
cd pomodolist
```

### 2. Install Dependencies  
```bash
npm install
```

### 3. Start the Development Server  
```bash
ng serve
```

### 4. Open the App in Your Browser  
Go to:  
```
http://localhost:4200
```

---

## 📂 Project Structure

```
src/
├── app/
│   ├── app.component.ts        # Root component
│   ├── pomodoro-timer/         # Pomodoro Timer component
│   ├── todo-list/              # To-Do List component
│   └── styles.css              # Global styles
├── assets/                     # Static assets
└── environments/               # Environment configurations
```

---

## 📸 Screenshots

### Main Screen  
![Main Screen](/screenshot.png)

### Task Management  
![Task Management](/screenshot_2.png)

---

## 🌱 Why Use PomodoList?
1. **Elegant Companion**

   - The app is designed to always run, providing a steady and reliable productivity boost.
2. **Stay Focused**

   - The Pomodoro timer and simple task manager help you focus on your priorities without distractions.
3. **Organize Effortlessly**

   - Quickly add, reorder, and complete tasks as priorities evolve.
4. **Persistent Workflow**

   - Tasks and timers are saved and resumed automatically, ensuring no progress is lost.

---

## 🤝 Contributing

We welcome contributions!  
1. Fork the repository.  
2. Create a new branch:  
   ```bash
   git checkout -b feature-name
   ```  
3. Commit your changes:  
   ```bash
   git commit -m "Add your feature"
   ```  
4. Push to the branch:  
   ```bash
   git push origin feature-name
   ```  
5. Open a pull request.

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

**PomodoList** – *Your elegant productivity companion to stay focused and organized.* 🚀
