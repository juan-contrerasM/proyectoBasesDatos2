import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  alert(type: 'success' | 'error' | 'warning' | 'info', message: string, autoClose = true) {
    Swal.fire({
      icon: type,
      title: message,
      timer: autoClose ? 3000 : undefined,
      timerProgressBar: autoClose,
      showConfirmButton: !autoClose
    });
  }

}
