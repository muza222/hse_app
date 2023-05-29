import { Component, OnInit } from '@angular/core';
import { SessionStoreService } from '@core/session-store/session-store.service';
import { Session } from '@core/session-store/session.interface';
import { BehaviorSubject } from 'rxjs';
import { LocaleChoiceService } from '@core/locale-choice/locale-choice.service';
import { Locale, UserType } from '@core/enums';
import { SsoService } from '@core/backend/sso.service';

@Component({
    selector: 'hse-header',
    templateUrl: './hse-header.component.html',
    styleUrls: ['./hse-header.component.scss'],
})
export class HseHeaderComponent implements OnInit {
    session: Session;
    session$: BehaviorSubject<Session>;
    lang: string;
    roles;
    rolesList;

    private session1: Session = {
        id: '1',
        firstname: {
            ru: 'Музаффар',
            en: 'Muzzafar',
        },
        surname: {
            ru: 'Садуллаев',
            en: 'Sadullaev',
        },
        patronymic: {
            ru: 'Садуллаев',
            en: 'Sadullaev',
        },
        activeRole: {
            name: UserType.STUDENT
        },
        roles: [
            {
                name: UserType.STUDENT,
                profiles: 'string',
            }
        ],
    };

    constructor(
        public sessionStorage: SessionStoreService,
        public localeChoice: LocaleChoiceService,
        private ssoService: SsoService
    ) {}

    ngOnInit(): void {
        console.log('here');
        this.lang = this.localeChoice.getCurrentLocale().name.toUpperCase();
        this.session = this.sessionStorage.getSession();
        console.log('this session ' + this.session.activeRole.name);
        this.roles = this.sessionStorage.getSession().roles;
        if (this.roles && this.hasSuperEmployeeRoles(this.roles)) {
            this.roles = this.roles.filter((role) => role.name !== "EMPLOYEE");
        }
        this.rolesList = Object.values(UserType).map((role) => ({ name: role }));
    }

    changeRole(role) {
      //  if (this.session) {
        this.session1.activeRole = role;
        this.sessionStorage.setSession(this.session1);
        this.session.activeRole = role;
        console.log(this.session.activeRole);
    }

    logIn() {
        this.ssoService.auth();
    }

    logOut() {
        this.ssoService.logout();
    }

    setLanguage(value: Locale) {
        this.localeChoice.setLang(value);
        document.documentElement.lang = value;
        this.lang = this.localeChoice.getCurrentLocale().name.toUpperCase();
    }

    hasSuperEmployeeRoles(roles) {
        return !!roles.find(
            (role) => role.name === "EPP_SUPERVISOR"
        );
    }
}
