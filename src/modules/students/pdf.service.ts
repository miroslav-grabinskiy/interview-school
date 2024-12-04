import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';
import { ScheduleTemplateData } from './helpers/schedule.templateData.helper';
import { EDays } from './helpers/days.helper';

@Injectable()
export class PdfService {
  generateSchedulePdf(scheduleData: ScheduleTemplateData): Readable {
    const doc = new PDFDocument();
    
    // Add title
    doc.fontSize(16).text('Class Schedule', { align: 'center' });
    doc.moveDown();

    // Format time (assuming time is in 24hr format like 1430)
    const formatTime = (time: number) => {
      const timeStr = time.toString().padStart(4, '0');
      const hours = parseInt(timeStr.slice(0, 2));
      const minutes = timeStr.slice(2);
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours > 12 ? hours - 12 : hours;
      return `${displayHours}:${minutes} ${period}`;
    };
    
    // Add schedule by day group
    Object.entries(scheduleData).forEach(([dayGroup, sections]: [EDays, ScheduleTemplateData[EDays]]) => {
      // Day group header
      doc.fontSize(14)
         .fillColor('blue')
         .text(dayGroup, { underline: true });
      doc.moveDown(0.5);

      sections.forEach((section: any) => {
        doc.fontSize(12)
           .fillColor('black')
           .text([
             `${formatTime(section.startTime)} - ${formatTime(section.endTime)}`,
             `Subject: ${section.subject}`,
             `Room: ${section.classroom}`,
             `Teacher: ${section.teacher}`
           ].join('\n'), {
             indent: 20,
             lineGap: 5
           });
        doc.moveDown();
      });

      doc.moveDown();
    });

    doc.end();
    return doc;
  }
}
