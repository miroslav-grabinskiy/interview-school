import { Section } from '../db/entities/section.entity';
import { EDays } from './days.helper';

export type ScheduleTemplateData = Record<EDays, Section[]>;

export function generateScheduleTemplateData(studentName: string, mwfDays: Section[], tthDays: Section[], everydayDays: Section[]): ScheduleTemplateData {
  return {
    [EDays.M]: mwfDays,
    [EDays.T]: tthDays,
    [EDays.W]: mwfDays,
    [EDays.Th]: tthDays,
    [EDays.F]: mwfDays,
    [EDays.S]: everydayDays,
    [EDays.Su]: everydayDays,
  };
}
