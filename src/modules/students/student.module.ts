import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './db/entities/student.entity';
import { Section } from './db/entities/section.entity';
import { StudentSection } from './db/entities/student_section.entity';
import { StudentRepository } from './db/repositories/student.repository';
import { SectionRepository } from './db/repositories/section.repository';
import { StudentSectionRepository } from './db/repositories/student_section.repository';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { PdfService } from './pdf.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, StudentSection, Section]),
  ],
  providers: [
    StudentService,
    PdfService,
    StudentRepository,
    SectionRepository,
    StudentSectionRepository
  ],
  controllers: [StudentController],
})
export class StudentModule {}
