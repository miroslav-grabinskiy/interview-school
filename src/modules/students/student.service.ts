import { ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { StudentRepository } from './db/repositories/student.repository';
import { SectionRepository } from './db/repositories/section.repository';
import { StudentSectionRepository } from './db/repositories/student_section.repository';
import { PdfService } from './pdf.service';
import { concatSortedArraysAndSortBy } from '../../libs/concatSortedArraysAndSortBy';
import { Readable } from 'stream';
import { generateScheduleTemplateData } from './helpers/schedule.templateData.helper';
import { postgresEnumValueToString } from '../../libs/postgresEnum';
import { EDaysOfWeekSet } from './helpers/days.helper';

@Injectable()
export class StudentService {
  constructor(
    private readonly pdfService: PdfService,
    private readonly studentRepository: StudentRepository,
    private readonly sectionRepository: SectionRepository,
    private readonly studentSectionRepository: StudentSectionRepository
  ) {}

  async joinSection(studentId: number, sectionId: number): Promise<void> {
    const section = await this.sectionRepository.findById(sectionId);
    if (!section) throw new NotFoundException(`Section with ID ${sectionId} not found.`);

    const student = await this.studentRepository.findById(studentId);
    if (!student) throw new NotFoundException(`Student with ID ${studentId} not found.`);

    const isHaveConflict = await this.studentRepository.isStudentHasSectionsInThisTime(studentId, section.startTime, section.endTime, postgresEnumValueToString<EDaysOfWeekSet>(section.daysOfWeek));
    if (isHaveConflict) throw new ConflictException(`Student already has a section in this time.`);

    await this.studentSectionRepository.addStudentToSection(section, student);
  }

  async leaveSection(studentId: number, sectionId: number): Promise<void> {
    const student = await this.studentRepository.findById(studentId);
    if (!student) throw new NotFoundException(`Student with ID ${studentId} not found.`);

    const section = await this.sectionRepository.findById(sectionId);
    if (!section) throw new NotFoundException(`Section with ID ${sectionId} not found.`);

    await this.studentSectionRepository.removeSectionFromStudent(sectionId, studentId);
  }

  async generateSchedulePdf(studentId: number): Promise<Readable> {
    const student = await this.studentRepository.findById(studentId);
    if (!student) throw new NotFoundException(`Student with ID ${studentId} not found.`);

    const sectionGroups = await this.studentRepository.getSchedule(studentId);
    if (!sectionGroups) throw new InternalServerErrorException('Something went wrong');

    const mwfDays = concatSortedArraysAndSortBy(sectionGroups.MWF, sectionGroups.EVERYDAY, 'startTime');
    const tthDays = concatSortedArraysAndSortBy(sectionGroups.TTH, sectionGroups.EVERYDAY, 'startTime');

    const scheduleTemplateData = generateScheduleTemplateData(student.name, mwfDays, tthDays, sectionGroups.EVERYDAY);

    return this.pdfService.generateSchedulePdf(scheduleTemplateData);
  }
}
