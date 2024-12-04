import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';
import { Section } from '../entities/section.entity';
import { EDaysOfWeekSet, getDaysOfWeekConflictSets } from '../../helpers/days.helper';

@Injectable()
export class StudentRepository {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
  ) {}

  async findById(studentId: number): Promise<Student> {
    return this.studentRepository.findOne({ where: { id: studentId } });
  }

  async isStudentHasSectionsInThisTime(studentId: number, startTime: number, endTime: number, currentDaysOfWeek: EDaysOfWeekSet): Promise<boolean> {
    const conflictSets = getDaysOfWeekConflictSets(currentDaysOfWeek);
    console.log({'conflictSets': conflictSets});

    const query = this.sectionRepository
      .createQueryBuilder('section')
      .innerJoin('section.studentSections', 'studentSection', 'studentSection.studentId = :studentId', { studentId })
      .where(
        'section."daysOfWeek" = ANY(:conflictSets)', 
        { conflictSets: conflictSets }
      )
      .andWhere(
        'section."startTime" <= :endTime AND section."endTime" >= :startTime',
        { startTime, endTime }
      );

    console.log('SQL:', query.getSql());
    console.log('Parameters:', query.getParameters());

    const section = await query.getOne();
    console.log('Result:', section);

    return !!section;
  }

  async getSchedule(studentId: number): Promise<ScheduleGroups> {
    const result = await this.sectionRepository
      .createQueryBuilder('section')
      .innerJoin('section.studentSections', 'studentSection')
      .leftJoinAndSelect('section.classroom', 'classroom')
      .leftJoinAndSelect('section.subject', 'subject')
      .leftJoinAndSelect('section.teacher', 'teacher')
      .where('studentSection.studentId = :studentId', { studentId })
      .select(`
        json_build_object(
          'EVERYDAY', COALESCE(
            json_agg(
              json_build_object(
                'id', section.id,
                'startTime', section."startTime",
                'endTime', section."endTime",
                'classroom', classroom.name,
                'subject', subject.name,
                'teacher', teacher.name
              ) ORDER BY section."startTime"
            ) FILTER (WHERE section."daysOfWeek"::text LIKE '%EVERYDAY%'),
            '[]'
          ),
          'MWF', COALESCE(
            json_agg(
              json_build_object(
                'id', section.id,
                'startTime', section."startTime",
                'endTime', section."endTime",
                'classroom', classroom.name,
                'subject', subject.name,
                'teacher', teacher.name
              ) ORDER BY section."startTime"
            ) FILTER (WHERE section."daysOfWeek"::text LIKE '%MWF%'),
            '[]'
          ),
          'TTH', COALESCE(
            json_agg(
              json_build_object(
                'id', section.id,
                'startTime', section."startTime",
                'endTime', section."endTime",
                'classroom', classroom.name,
                'subject', subject.name,
                'teacher', teacher.name
              ) ORDER BY section."startTime"
            ) FILTER (WHERE section."daysOfWeek"::text LIKE '%TTH%'),
            '[]'
          )
        ) as schedule`)
      .getRawOne();

    return result.schedule;
  }
}

export interface ScheduleGroups {
  EVERYDAY: Section[];
  MWF: Section[];
  TTH: Section[];
}