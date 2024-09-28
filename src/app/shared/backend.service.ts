import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private currentBackendUrlSubject: BehaviorSubject<string> = new BehaviorSubject<string>('http://localhost:8080/iLib/v1');
  private currentBackendNameSubject: BehaviorSubject<string> = new BehaviorSubject<string>('Java Backend');

  currentBackendUrl$ = this.currentBackendUrlSubject.asObservable();
  currentBackendName$ = this.currentBackendNameSubject.asObservable();

  constructor() {}

  switchToJavaBackend(): void {
    this.currentBackendNameSubject.next("Java Backend");
    this.currentBackendUrlSubject.next('http://localhost:8080/iLib/v1');
  }

  switchToCsharpBackend(): void {
    this.currentBackendNameSubject.next("C# Backend");
    this.currentBackendUrlSubject.next('http://localhost:5062/iLib/v1');
  }

  getBackendUrl(): string {
    return this.currentBackendUrlSubject.getValue();
  }

  getCurrentBackendName(): string {
    return this.currentBackendNameSubject.getValue();
  }
}
