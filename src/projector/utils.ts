export const findIndexs = <E>(array: Array<E>, r: (element: E, index: number, array: Array<E>) => boolean): number[] => {
  return array.reduce<number[]>((previousValue, currentValue, index) => r(currentValue, index, array) ? (previousValue.push(index), previousValue) : previousValue, [])
};
