import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { Session } from "@core/session-store/session.interface";
import { BehaviorSubject } from "rxjs";
import { CookieService } from "ngx-cookie";
import { UserType } from '@core/enums';

@Injectable({
    providedIn: "root",
})
export class SessionStoreService {
    private readonly USER_LANG = "user-lang";
    private readonly ACCESS_TOKEN = "access-token";
    private readonly SESSION = "session";

    session: Session;
    isBrowser: boolean;
    session$: BehaviorSubject<Session> = new BehaviorSubject<Session>(null);

    constructor(@Inject(PLATFORM_ID) platformId: object, private cookieService: CookieService) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    getUserLang(): string | null {
        if (!this.isBrowser) {
            return null;
        }

        return localStorage.getItem(this.USER_LANG);
    }

    setUserLang(value: string | null) {
        if (!this.isBrowser) {
            return;
        }

        localStorage.setItem(this.USER_LANG, value);
    }

    getSession(): Session | null {
        return JSON.parse(localStorage.getItem(this.SESSION));
    }

    getRuFio(): string {
        const fio = [this.session.surname.ru, this.session.firstname.ru];

        if (this.session.patronymic) {
            fio.push(this.session.patronymic.ru);
        }

        return fio.filter(Boolean).join(' ');
    }

    setSession(session: Session | null) {
        if (session !== null) {
            this.session = session;
            this.session$.next(session);
            localStorage.setItem(this.SESSION, JSON.stringify(session));
        }
        if (this.getSession() == null) {
            console.log('session null');
            const session1: Session = {
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
            this.session = session1;
            this.session$.next(session1);
            localStorage.setItem(this.SESSION, JSON.stringify(session1));
        }
        if (!session) {
            this.cookieService.remove(this.ACCESS_TOKEN);
        }
    }

    getAccessToken() {
        return this.cookieService.get(this.ACCESS_TOKEN);
    }
}
