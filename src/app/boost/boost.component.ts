import { Component } from '@angular/core';

@Component({
  selector: 'app-boost',
  standalone: true,
  imports: [],
  templateUrl: './boost.component.html',
  styleUrl: './boost.component.css'
})
export class BoostComponent {
  progress: number = 0;

  // Function to update the progress value
  updateProgress(value: number): void {
    this.progress = Math.max(0, Math.min(100, this.progress + (100/3)));
  }
}
