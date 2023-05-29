import { LeftMenuItemId } from '@shared/modules/left-menu/constants';
import { UserType } from '@core/enums';

export interface LeftMenuItem {
  id: LeftMenuItemId;
  nameKey: string;
  icon?: string;
  link: string;
  linkOptions: boolean;
  userTypes: UserType[];
  featureIsAvailable: boolean;
  authRequired: boolean;
  subLinks?: LeftMenuItem[];
}

