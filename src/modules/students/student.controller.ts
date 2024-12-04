import { Controller, Post, Delete, Param, Get, HttpException, HttpStatus, Res, Header } from '@nestjs/common';
import { StudentService } from './student.service';
import { Response } from 'express';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post(':id/sections/:sectionId')
  async joinSection(@Param('id') studentId: string, @Param('sectionId') sectionId: string): Promise<void> {
    const parsedStudentId = Number(studentId);
    const parsedSectionId = Number(sectionId);

    if (isNaN(parsedStudentId) || isNaN(parsedSectionId)) {
      throw new HttpException('Student ID and Section ID must be valid numbers', HttpStatus.BAD_REQUEST);
    }

    await this.studentService.joinSection(parsedStudentId, parsedSectionId);
  }

  @Delete(':id/sections/:sectionId')
  async leaveSection(@Param('id') studentId: string, @Param('sectionId') sectionId: string): Promise<void> {
    const parsedStudentId = Number(studentId);
    const parsedSectionId = Number(sectionId);

    if (isNaN(parsedStudentId) || isNaN(parsedSectionId)) {
      throw new HttpException('Student ID and Section ID must be valid numbers', HttpStatus.BAD_REQUEST);
    }

    await this.studentService.leaveSection(parsedStudentId, parsedSectionId);
  }

  @Get(':id/schedule/pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=schedule.pdf')
  async getSchedulePdf(
    @Param('id') id: number,
    @Res() res: Response
  ): Promise<void> {
    const stream = await this.studentService.generateSchedulePdf(id);
    stream.pipe(res);
  }
}
