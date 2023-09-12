import {
  BaseEntity,
  Equal,
  FindOperator,
  FindOptionsWhere,
  Like,
} from 'typeorm';

import _ from 'lodash';

export type WhereTypeFunc = (t: string) => FindOperator<any>;
export const WhereType = {
  Equals: (t) => Equal(t),
  NumberEquals: (t) => Equal(parseInt(t)),
  Contains: (t) => Like(`%${t}%`),
  UpperCase: (t) => Like(`%${t.toUpperCase()}%`),
  LowerCase: (t) => Like(`%${t.toLowerCase()}%`),
};

export function generateWhere<T extends BaseEntity>(
  where: FindOptionsWhere<T>,
  search: string | undefined,
  target: { [key: string]: WhereTypeFunc },
): FindOptionsWhere<T>[] | FindOptionsWhere<T> {
  const newWhere: FindOptionsWhere<T>[] = [];
  let globalWhere: FindOptionsWhere<T> = {};
  if (!search) return where;
  if (!Array.isArray(where)) globalWhere = where;
  for (const [key, whereType] of Object.entries(target)) {
    const operator = whereType(search);
    if (!operator.value || _.get(globalWhere, key)) continue;
    const obj = _.set({ ...globalWhere }, key, operator);
    newWhere.push(obj);
  }

  return newWhere;
}
