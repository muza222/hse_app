import { MatSort } from '@angular/material/sort';
import { orderBy as _orderBy } from 'lodash/fp';

export const sortFunction = <T>(arr: T[], sort: MatSort): T[] => {
  if (!sort.active || sort.direction === '') {
      return arr;
    }

  return _orderBy<T>([`name.${sort.active}`], sort.direction as 'asc' | 'desc')(arr);
};
