// shared-service.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private selectedModel: string = '';

  getSelectedModel(): string {
    return this.selectedModel;
  }

  setSelectedModel(model: string) {
    this.selectedModel = model;
  }
}
