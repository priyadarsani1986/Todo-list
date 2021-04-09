import { trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { TasksServiceService } from '../tasks-service.service';
import { Tasks } from '../todo-interface';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})

export class ListComponent implements OnInit {

  today: number = Date.now();
  tasks : Tasks[] = [];
  taskId: number;
  taskTitle: string;
  editing: boolean = false;
  beforeEditing: string;

  constructor(private tasksServiceService: TasksServiceService) { }

  ngOnInit(): void {

    this.beforeEditing = '';
    this.taskId;
    this.taskTitle = '';

    // GetTask method invoked to retrieve existing tasks
    this.tasksServiceService.getTasks().subscribe(response => {
      this.tasks = response; 
    });
  }

  // AddTask method invoked to post new task 
  addTask() {
    if (this.taskTitle.trim().length === 0) return;
    let task = {
      id: this.taskId,
      title: this.taskTitle,
      completed: false,
      editing: false
    }
    this.tasksServiceService.addTask(task).subscribe((data: Tasks) => {
      console.log(data);
    });
    this.tasks.push({
      id: this.taskId,
      title: this.taskTitle,
      completed: false,
      editing: false
    })
    this.taskTitle = '';
    this.ngOnInit();
  }

  // EditTask method invoked to update existing tasks
  toggleEdit(event: Tasks) {
    event.editing = !event.editing;
  }

  editTask(editEvent: Tasks) {
    this.beforeEditing = editEvent.title;
    editEvent.editing = !editEvent.editing;

    this.tasksServiceService.editTask(editEvent).subscribe(data => {
      this.tasks = this.tasks.map((task: Tasks) => {
        if (task.title === editEvent.title) {
          task = Object.assign({}, task, editEvent);
        }
        return task;
      })
    });
  }
  doneEditing(task: Tasks): void {
    if (task.title.trim().length === 0) {
      task.title = this.beforeEditing;
    }
    task.editing = false;
  }
  cancelEditing(task: Tasks) {
    task.title = this.beforeEditing;
    task.editing = false;
  }

  remaining(): number {
    return this.tasks.filter(task => !task.completed).length;
  }

  atleastOneCompleted(): boolean {
    return this.tasks.filter(task => task.completed).length > 0;
  }

  //DeleteTask method invoked to delete a task
  deleteTask(taskId) {
    this.tasks = this.tasks.filter(task => task.id !== taskId);

    this.tasksServiceService.deleteTask(taskId)
      .subscribe(data => this.tasks.filter(task => {
        return task !== data;
      }))
  }
  deleteCompletedTask() {
    const selectedItems = this.tasks.filter(item => item.completed).map(i => i.id);
    console.log(selectedItems);
    selectedItems.forEach(value => {
      this.tasksServiceService.deleteTask(value)
        .subscribe(res => {
          this.tasks = this.tasks.filter(task => !task.completed);
        });
    });
  }

  selectAll(event): void {
    this.tasks.forEach(x => x.completed = event.target.checked)
  }
}
