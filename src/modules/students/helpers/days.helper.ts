import { stringToPostgresEnum } from "../../../libs/postgresEnum";

export enum EDaysOfWeekSet {
  MWF = 'MWF',
  TTH = 'TTH',
  EVERYDAY = "EVERYDAY",
}

export enum EDays {
  M = 'Monday',
  T = 'Tuesday',
  W = 'Wednesday',
  Th = 'Thursday',
  F = 'Friday',
  S = 'Saturday',
  Su = 'Sunday',
}

export const EDaysToSetMap = {
  [EDaysOfWeekSet.MWF]: [EDays.M, EDays.W, EDays.F],
  [EDaysOfWeekSet.TTH]: [EDays.T, EDays.Th],
  [EDaysOfWeekSet.EVERYDAY]: [EDays.M, EDays.T, EDays.W, EDays.Th, EDays.F, EDays.S, EDays.Su],
};

export const days = Object.keys(EDaysOfWeekSet);

export const currentDaysOfWeekSetToConflictSets: Record<EDaysOfWeekSet, EDaysOfWeekSet[]> = {
  [EDaysOfWeekSet.EVERYDAY]: [EDaysOfWeekSet.MWF, EDaysOfWeekSet.TTH, EDaysOfWeekSet.EVERYDAY],
  [EDaysOfWeekSet.MWF]: [EDaysOfWeekSet.MWF, EDaysOfWeekSet.EVERYDAY],
  [EDaysOfWeekSet.TTH]: [EDaysOfWeekSet.TTH, EDaysOfWeekSet.EVERYDAY],
};

export function getDaysOfWeekConflictSets(currentDaysOfWeek: EDaysOfWeekSet): EDaysOfWeekSet[] {
  if (currentDaysOfWeekSetToConflictSets[currentDaysOfWeek]) {
    return currentDaysOfWeekSetToConflictSets[currentDaysOfWeek].map(stringToPostgresEnum<EDaysOfWeekSet>);
  }

  throw new Error('Invalid days of week set');
}
