import { Component } from '@angular/core';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {
  activeTab: string = 'tasks'; // Set default active tab

  showTab(tab: string): void {
    this.activeTab = tab;
    // Update the active class for the tab headers
    const tasksTab = document.getElementById('tasks-tab');
    const challengesTab = document.getElementById('challenges-tab');

    if (tasksTab && challengesTab) {
      if (tab === 'tasks') {
        tasksTab.classList.add('active');
        challengesTab.classList.remove('active');
      } else {
        tasksTab.classList.remove('active');
        challengesTab.classList.add('active');
      }
    }

    // Update the content visibility
    const tasksContent = document.getElementById('tasks-content');
    const challengesContent = document.getElementById('challenges-content');

    if (tasksContent && challengesContent) {
      if (tab === 'tasks') {
        tasksContent.classList.add('active');
        challengesContent.classList.remove('active');
      } else {
        tasksContent.classList.remove('active');
        challengesContent.classList.add('active');
      }
    }
  }
}
