import { Pipe, PipeTransform } from '@angular/core';
import { LeftMenuItem } from '@shared/modules/left-menu/types/left-menu-item.interface';
import { SessionStoreService } from '@core/session-store/session-store.service';


@Pipe({
  name: 'leftMenuFilter'
})
export class LeftMenuFilterPipe implements PipeTransform {

  constructor(private sessionStore: SessionStoreService) {}

  transform(items: LeftMenuItem[] = []): LeftMenuItem[] {
    const session = this.sessionStore.session;

    return items.filter((item) => {
      if (!session) {
        return item.userTypes.length === 0 && item.featureIsAvailable && !item.authRequired;
      }

      return (item.userTypes.length === 0 || item.userTypes.includes(session.activeRole.name))
        && item.featureIsAvailable;
    });
  }

}
