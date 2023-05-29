import { MatTableDataSource } from '@angular/material/table';
import { BaseEntity } from '@core/interfaces/base-entity.interface';
import { sortFunction } from '@tools/localized-sort';

export default (that, list) => {
  that.dataSource = new MatTableDataSource<BaseEntity>(list);
  that.dataSource.sortData = sortFunction;
  that.dataSource.sort = that.sort;
  that.changeDetectorRefs.detectChanges();
};
