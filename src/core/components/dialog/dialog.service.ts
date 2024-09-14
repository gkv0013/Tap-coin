import {
  Injectable,
  ApplicationRef,
  Injector,
  ComponentRef,
  createComponent,
  TemplateRef,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DialogComponent } from './dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private _isOpen = new BehaviorSubject<boolean>(false);
  private _dialogConfig = new BehaviorSubject<{
    title: string;
    message: string;
    type: string;
    customClass: string;
    customTemplate?: TemplateRef<any> 
    onConfirm?: () => void;
    onCancel?: () => void;
  
  }>({
    title: '',
    message: '',
    type: '',
    customClass: '',
    customTemplate:undefined 
  });

  isOpen$ = this._isOpen.asObservable();
  dialogConfig$ = this._dialogConfig.asObservable();

  private dialogComponentRef: ComponentRef<DialogComponent> | null = null;

  constructor(
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  openDialog(config: {
    title: string;
    message: string;
    type: string;
    customClass: string;
    customTemplate?: TemplateRef<any>;
    onConfirm?: () => void;
    onCancel?: () => void;
  }) {
    this._dialogConfig.next(config);
    this._isOpen.next(true);


    this.dialogComponentRef = createComponent(DialogComponent, {
      environmentInjector: this.appRef.injector,
    });

 
    this.appRef.attachView(this.dialogComponentRef.hostView);
    document.body.appendChild(this.dialogComponentRef.location.nativeElement);

   
    this.dialogComponentRef.instance.confirmClick.subscribe(() => {
      if (config.onConfirm) {
        config.onConfirm();
      }
      this.closeDialog();
    });

    this.dialogComponentRef.instance.cancelClick.subscribe(() => {
      if (config.onCancel) {
        config.onCancel();
      }
      this.closeDialog();
    });
  }

  closeDialog() {
    this._isOpen.next(false);

    if (this.dialogComponentRef) {
      this.appRef.detachView(this.dialogComponentRef.hostView);
      this.dialogComponentRef.destroy();
      this.dialogComponentRef = null;
    }
  }
}
