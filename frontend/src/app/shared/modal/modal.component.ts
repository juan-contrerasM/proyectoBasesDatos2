import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @Input() visible = false;
  @Input() title = 'Modal';
  @Output() close = new EventEmitter<void>();
  @Output() accept = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onAccept() {
    this.accept.emit();
  }

  constructor() { }

  ngOnInit() {
  }

}
