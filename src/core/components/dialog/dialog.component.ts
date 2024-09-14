import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  inject,
  TemplateRef,
} from '@angular/core';
import { DialogService } from './dialog.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent implements OnInit {
  @Input() title!: string;
  @Input() type!: string;
  @Input() message!: string;
  @Input() customClass!: string;
  @Output() confirmClick = new EventEmitter();
  @Output() cancelClick = new EventEmitter();
  @Input() customTemplate?: TemplateRef<any>;
  @Input() isOpen = false;
  private dialogService = inject(DialogService);
  private subscriptions: Subscription = new Subscription();

  constructor() {}
  ngOnInit() {
    this.subscriptions.add(
      this.dialogService.isOpen$.subscribe((isOpen) => {
        this.isOpen = isOpen;
      })
    );

    this.subscriptions.add(
      this.dialogService.dialogConfig$.subscribe((config) => {
        this.title = config.title || this.title;
        this.message = config.message || this.message;
        this.type = config.type || this.type;
        this.customClass = config.customClass || this.customClass;
        this.customTemplate = config.customTemplate || this.customTemplate;
      })
    );
  }

  onClickContinue() {
    this.confirmClick.emit();
    this.dialogService.closeDialog();
  }
  onClickCancel() {
    this.cancelClick.emit();
    this.dialogService.closeDialog();
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
