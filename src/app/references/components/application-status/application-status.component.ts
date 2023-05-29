import { Component, Input, OnInit } from '@angular/core';
import { EppStatus } from '@core/enums';

@Component({
    selector: 'app-application-status',
    templateUrl: './application-status.component.html',
    styleUrls: ['./application-status.component.scss']
})
export class ApplicationStatusComponent implements OnInit {

    @Input()
    status: EppStatus;

    protected readonly EppStatus = EppStatus;

    getColor() {
        if (this.status === EppStatus.DONE) {
            return '#008EF6';
        } else if (this.status === EppStatus.WAITING) {
            return '#00A35F';
        } else {
            return '#E03A15';
        }
    }

    ngOnInit(): void {
    }
}
