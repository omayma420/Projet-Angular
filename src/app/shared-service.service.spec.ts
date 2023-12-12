// shared-service.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  selectedModel: string = '';

  setSelectedModel(model: string) {
    this.selectedModel = model;
  }
}
