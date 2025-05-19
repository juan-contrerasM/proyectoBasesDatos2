import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SessionService {

    private usuario: any = null;
    shouldWarn = true;

    setUsuario(usuario: any) {
        this.usuario = usuario;
    }

    getUsuario() {
        return this.usuario;
    }

    limpiar() {
        this.usuario = null;
    }

    getTipoUsuario(): string {
        return this.usuario?.TIPO_USUARIO || 'INVITADO';
    }

    getNombre(): string {
        return this.usuario?.PRIMER_NOMBRE || '';
    }

    getId(): string {
        return this.usuario?.NUM_IDENTIFICACION || '';
    }

}
