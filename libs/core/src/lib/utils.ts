import { Observable } from 'rxjs';

export const getRefId = (obj: any): string | null => {
  const symbolId = Object.getOwnPropertySymbols(obj).find((symbol) => {
    return String(symbol) === 'Symbol(id)';
  });

  return symbolId && obj[symbolId] ? obj[symbolId].toString() : null;
};

export const getObservableType = <T>(observable: Observable<T>): string => {
  return observable.constructor.name;
};

export const getObservableTag = <T>(
  observable: Observable<T>
): string | null => {
  const operator = observable['operator'];
  if (!operator) {
    return null;
  }

  const tag = (operator as unknown as Record<string, string>)['tag'];
  if (!tag) {
    return null;
  }

  return tag;
};
