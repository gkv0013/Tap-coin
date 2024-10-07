import { CommonService } from '../common.service';
import { CollectService } from '../../core/services/collect.service';
import {
  Component,
  ElementRef,
  AfterViewInit,
  Renderer2,
  ViewChild,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Goal } from '../../core/interface/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-green',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './green.component.html',
  styleUrl: './green.component.css',
})
export class GreenComponent {
  public commonService = inject(CommonService);
  public router = inject(Router);
  public goalsData: Goal[] = [];
  ngOnInit() {
    this.goalsData=this.commonService.getGoalData() ?? [];
  }
  routeToGoal(goal: Number) {
    this.commonService.setActiveTab('green');
    this.router.navigate(['/goals/' + goal]);
  }
}
