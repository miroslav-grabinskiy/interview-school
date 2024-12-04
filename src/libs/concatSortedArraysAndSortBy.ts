export function concatSortedArraysAndSortBy<T>(arrays1: T[], array2: T[], sortBy: string): T[] {
  let array1Index = 0;
  let array2Index = 0;
  const result = [];

  while (array1Index < arrays1.length && array2Index < array2.length) {
    if (arrays1[array1Index][sortBy] < array2[array2Index][sortBy]) {
      result.push(arrays1[array1Index]);
      array1Index++;
    } else {
      result.push(array2[array2Index]);
      array2Index++;
    }
  }

  return result;
}
