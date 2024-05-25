import { Component } from '@angular/core';

export interface Weather {
  main: {
    temp: number;
    temp_max?: number;
    temp_min?: number;
    humidity?: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  name: string;
  wind: {
    speed: number;
  };
}

@Component({
  selector: 'app-model',
  template: ''
})
export class ModelComponent {
}
