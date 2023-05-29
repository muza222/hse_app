import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Constants } from '@core/constants';
import { EppItem } from '@core/interfaces/epp-item.interface';
import { EppData } from '@core/backend/epp-data.interface';
import { EppFieldResponse } from '@core/backend/fields/epp-field-response';
import { random } from 'lodash';
import { EppStatus, UserType } from '../enums';

@Injectable({
    providedIn: "root",
})
export class StorageService {

    public epp: EppFieldResponse[] = [
        {
            name: {
                ru: "Справка об обучении",
                en: "123",
            },
            id: '1',
            applicant: 'Садуллаев Музаффар',
            date: Date.now(),
            hint: random(0, 10).toString(),
            mask: new Date(Date.now() + random(0, 1000000)).toLocaleTimeString().toString(),
            status: EppStatus.WAITING,
            executor: 'Пак Татьяна Альбертовна',
            executorId: '1',
        } as EppFieldResponse,
        {
            name: {
                ru: "Получение дубликата студенческого билета",
                en: "123",
            },
            id: '2',
            applicant: 'Иванов Иван',
            date: Date.UTC(2023, 4, 15, 18, 46),
            hint: random(0, 10).toString(),
            mask: new Date(Date.now() + random(0, 1000000)).toLocaleTimeString().toString(),
            status: EppStatus.CANCELLED,
            executor: 'Пак Татьяна Альбертовна',
            executorId: '1',
        } as EppFieldResponse,
        {
            name: {
                ru: 'Внесение изменений в персональные данные',
                en: "123",
            },
            id: '3',
            applicant: 'Просвирин Евгений',
            date: Date.UTC(2023, 4, 16, 21, 13),
            hint: random(0, 10).toString(),
            mask: new Date(Date.now() + random(0, 1000000)).toLocaleTimeString().toString(),
            status: EppStatus.DONE,
            executor: "Пак Татьяна Альбертовна",
            executorId: '1',
        } as EppFieldResponse,
        {
            name: {
                ru: "Заказ справки об обучении или о периоде обучения",
                en: "123",
            },
            id: '4',
            applicant: 'Александр Мишин',
            date: Date.UTC(2023, 4, 18, 10, 8),
            hint: random(0, 10).toString(),
            mask: new Date(Date.now() + random(0, 1000000)).toLocaleTimeString().toString(),
            status: EppStatus.WAITING,
            executor: 'Карпова Ольга Владимировна',
            executorId: '2',
        } as EppFieldResponse,
        {
            name: {
                ru: "Копия устава НИУ ВШЭ",
                en: "123",
            },
            id: '4',
            applicant: 'Александр Мишин',
            date: Date.UTC(2023, 4, 18, 10, 8),
            hint: random(0, 10).toString(),
            mask: new Date(Date.now() + random(0, 1000000)).toLocaleTimeString().toString(),
            status: EppStatus.WAITING,
            executor: 'Карпова Ольга Владимировна',
            executorId: '2',
        } as EppFieldResponse,
    ];
    private readonly URL = `${Constants.STORAGE_API_URL}`;

    constructor(private http: HttpClient) {}

    getEppList(): Promise<EppItem[]> {
        return firstValueFrom(this.http.get<EppItem[]>(`${this.URL}/epp`));
    }

    getEppById(id): Promise<EppData> {
        return Promise.resolve({
            id: 123,
            data: {
                epp_leader: JSON.stringify([
                    {
                        personId: 1,
                    },
                ]),
                epp_status: "Ожидает ответа",
                name: "Иванов Иван Иванович",
                dateOfBirth: "08.01.2005",
                faculty: "ФКН",
                level: "Бакалавриат",
                ep: "Программная инженерия",
                course: "1 курс",
                studentStatus: "Активный",
                phoneNumber: "88005553535",
                email: "dai@ya.ru",
                systemComment: "Нет комментариев",
                userComment: "Нет комментариев",
                status: "Выполнена",
            },
        });
        // TODO: remove after backend up
        return firstValueFrom(
            this.http.get<{ id: number; data: Record<string, string> }>(`${this.URL}/epp/${id}`)
        );
    }

    getAvailableApplications(): EppFieldResponse[] {
        let epp: EppFieldResponse[];
        epp = [
            {
                name: {
                    ru: 'Справка об обучении',
                    en: '123',
                },
                description: {
                    ru: 'Подтверждает факт обучения студента',
                    en: '123',
                },
                hint: random(0, 10).toString(),
                mask: new Date(Date.now() + random(0, 1000000)).toLocaleTimeString().toString(),
                status: EppStatus.WAITING,
                executor: 'Пак Татьяна',
            } as EppFieldResponse,
            {
                name: {
                    ru: 'Получение дубликата студенческого билета',
                    en: '123',
                },
                description: {
                    ru: 'Получение дубликата студенческого билета в случае его утери',
                    en: '123',
                },
                hint: random(0, 10).toString(),
                mask: new Date(Date.now() + random(0, 1000000)).toLocaleTimeString().toString(),
                status: EppStatus.CANCELLED,
                executor: 'Пак Татьяна',
            } as EppFieldResponse,
            {
                name: {
                    ru: 'Внесение изменений в персональные данные',
                    en: '123',
                },
                description: {
                    ru: 'Внесение изменения в ФИО',
                    en: '123',
                },
                hint: random(0, 10).toString(),
                mask: new Date(Date.now() + random(0, 1000000)).toLocaleTimeString().toString(),
                status: EppStatus.DONE,
                executor: 'Пак Татьяна',
            } as EppFieldResponse,
            {
                name: {
                    ru: 'Заказ справки об обучении или о периоде обучения',
                    en: '123',
                },
                description: {
                    ru: 'Форма заказа справок для менеджеров образовательных программ',
                    en: '123',
                },
                hint: random(0, 10).toString(),
                mask: new Date(Date.now() + random(0, 1000000)).toLocaleTimeString().toString(),
                status: EppStatus.WAITING,
                executor: 'Шилов Валерий',
            } as EppFieldResponse,
        ];
        return epp;
    }

    parseEpp(id: string, role: UserType, eppList: EppItem[]): EppFieldResponse[] {
        // tslint:disable-next-line:prefer-const
        let result: EppFieldResponse[] = [];
        this.epp.forEach(value => {
            if (role === UserType.STUDENT && value.id === id) {
                result.push(value as EppFieldResponse);
            } else if (role === UserType.SUPERVISOR) {
                result.push(value as EppFieldResponse);
            } else if (role === UserType.EMPLOYEE && value.executorId === id) {
                result.push(value as EppFieldResponse);
            }
        });
        return result;
    }
}
