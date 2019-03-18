import { MessageService } from "primeng/components/common/messageservice";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class Toastr {
    constructor(private messageService: MessageService) {}

    public error(title: string, body: string) {
        this.messageService.add({
            severity: 'error',
            summary: title,
            detail:body,
            sticky: true
        })
    }

    public success(title: string, body: string) {
        this.messageService.add({
            severity: 'success',
            summary: title,
            detail:body,
            sticky: true
        })
    }


}