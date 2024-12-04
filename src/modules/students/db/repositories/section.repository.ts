import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Section } from '../entities/section.entity';
import { forwardRef, Inject } from '@nestjs/common';
import { StudentRepository } from './student.repository';
import { Student } from '../entities/student.entity';

@Injectable()
export class SectionRepository extends Repository<Section> {
  constructor(
    @InjectRepository(Section)
    repository: Repository<Section>,
    @InjectRepository(Section)
    private readonly studentRepository: Repository<Student>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findById(sectionId: number): Promise<Section> {
    const section = await this.findOne({
      where: { id: sectionId },
    });

    if (!section) {
      throw new NotFoundException(`Section with ID ${sectionId} not found.`);
    }

    return section;
  }
}
