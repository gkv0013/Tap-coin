
import { Injectable, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private bsModalRef?: BsModalRef;

  constructor(private modalService: BsModalService) {}

  openModal(template: TemplateRef<any>) {
    this.bsModalRef = this.modalService.show(template);
  }

  closeModal() {
    if (this.bsModalRef) {
      this.bsModalRef.hide();
    }
  }
}
