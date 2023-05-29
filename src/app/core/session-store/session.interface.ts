import { LocalizedName } from "@core/interfaces/localized-name";
import { UserType } from "@core/enums";

export interface Session {
    id: string;
    firstname: LocalizedName;
    surname: LocalizedName;
    patronymic: LocalizedName;
    activeRole: {
        name: UserType;
    };
    roles: [
        {
            name: UserType;
            profiles: string;
        }
    ];
}
