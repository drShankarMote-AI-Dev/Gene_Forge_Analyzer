import { Document, Packer, Paragraph, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

export const generateCompleteWordReport = async (sectionIds: Array<{ id: string, title: string }>) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    // Not running in a browser, do nothing
    return false;
  }
  try {
    const children = [
      new Paragraph({
        text: 'GENEFORGE: GENOMIC ANALYSIS REPORT',
        heading: HeadingLevel.TITLE,
        alignment: "center",
      }),
      new Paragraph({
        text: '--------------------------------------------------',
        alignment: "center",
      }),
      new Paragraph({
        text: `Analysis Date: ${new Date().toLocaleDateString()}`,
        alignment: "right",
      }),
      new Paragraph({
        text: `Security Classification: RESEARCH CONFIDENTIAL`,
        alignment: "right",
      }),
      new Paragraph({ text: '' }),
      new Paragraph({
        text: 'EXECUTIVE SUMMARY',
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({
        text: 'This document contains a comprehensive computational analysis of the provided genomic sequence. The following sections include base composition metrics, orientation synthesis, protein translation, and advanced clinical mapping results.',
      }),
      new Paragraph({ text: '' }),
    ];

    for (const section of sectionIds) {
      const el = document.getElementById(section.id);
      if (el) {
        children.push(
          new Paragraph({
            text: section.title.toUpperCase(),
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: el.innerText.trim() || 'No data captured for this section.',
          }),
          new Paragraph({ text: '' })
        );
      }
    }
    const doc = new Document({
      sections: [
        {
          children,
        },
      ],
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'Complete_DNA_Analysis_Report.docx');
    return true;
  } catch (err) {
    // Prevent crash/white page
    console.error('Word export failed:', err);
    return false;
  }
};
