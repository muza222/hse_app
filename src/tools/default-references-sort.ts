import { sortFunction } from '@tools/localized-sort';
import { Sort } from '@angular/material/sort';

export default (that) => {
  that.dataSource.sortData = sortFunction;
  that.dataSource.sort = that.sort;
  const sortState: Sort = {active: `${that.locale}`, direction: 'asc'};
  that.sort.active = sortState.active;
  that.sort.direction = sortState.direction;
  that.sort.sortChange.emit(sortState);
}
