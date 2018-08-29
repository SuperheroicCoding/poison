import {filter} from 'rxjs/operators';

export const notNull = value => value != null;

export const filterNotNull = filter(notNull);
