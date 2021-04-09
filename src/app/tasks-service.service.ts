import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tasks } from './todo-interface';
import { map } from "rxjs/operators";

// API url 
const URL = 'http://localhost:3000/tasks';

@Injectable({
    providedIn: 'root'
})

export class TasksServiceService {

    constructor(private httpClient: HttpClient) { }
    
    getTasks(): Observable<Tasks[]> {
        return this.httpClient.get<Tasks[]>(URL)
    }

    addTask(task: Tasks): Observable<Tasks> {
        return this.httpClient.post<Tasks>(URL, task, {headers: new HttpHeaders({'Content-Type': 'application/json'})})
    }

    editTask(task: Tasks): Observable<Tasks[]> {
        return this.httpClient.put(URL + '/' + task.id, task).pipe(map((response: any) => response));
    }

    deleteTask(id: number) {
        return this.httpClient.delete(URL + '/' + id).pipe(map((res: any) => res));
    }

}
