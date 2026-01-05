
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDFReport = async (reportTitle: string, elementId: string) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    const element = document.getElementById(elementId);

    if (!element) {
      throw new Error(`Element with id ${elementId} not found`);
    }

    // --- HEADER ---
    pdf.setFillColor(248, 250, 252);
    pdf.rect(0, 0, pageWidth, 40, 'F');
    pdf.setDrawColor(226, 232, 240);
    pdf.line(0, 40, pageWidth, 40);

    pdf.setTextColor(30, 132, 168);
    pdf.setFontSize(22);
    pdf.setFont("helvetica", "bold");
    pdf.text("GENEFORGE", 20, 22);

    pdf.setTextColor(148, 163, 184);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text(reportTitle.toUpperCase(), 20, 32);

    // Date on the right
    pdf.text(`ISSUED: ${new Date().toLocaleDateString()}`, pageWidth - 60, 22);

    // --- CAPTURE ---
    // Hide buttons during capture
    const buttons = element.querySelectorAll('button');
    buttons.forEach(btn => (btn as HTMLElement).style.visibility = 'hidden');

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    // Restore buttons
    buttons.forEach(btn => (btn as HTMLElement).style.visibility = 'visible');

    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL('image/png');

    // Add image to PDF
    pdf.addImage(imgData, 'PNG', 20, 50, imgWidth, imgHeight);

    // --- FOOTER ---
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184);
    pdf.text("© 2025 GENE FORGE LABS • ANALYTICAL INTELLIGENCE LAYER v4.0.2", pageWidth / 2, pageHeight - 10, { align: 'center' });

    pdf.save(`${reportTitle.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating single PDF:', error);
    return false;
  }
};

export const generateCompleteReport = async (metadata?: { sequenceLength: number, title?: string }) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;

    // --- COVER PAGE ---
    // Background gradient hint (subtle)
    pdf.setFillColor(240, 248, 255); // Light azure
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Branding
    pdf.setTextColor(30, 132, 168); // Primary color
    pdf.setFontSize(48);
    pdf.setFont("helvetica", "bold");
    pdf.text("GENEFORGE", pageWidth / 2, 80, { align: 'center' });

    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text("PROFESSIONAL GENOMIC ANALYSIS DOSSIER", pageWidth / 2, 95, { align: 'center' });

    // Divider
    pdf.setDrawColor(30, 132, 168);
    pdf.setLineWidth(1);
    pdf.line(pageWidth / 4, 110, (3 * pageWidth) / 4, 110);

    // Metadata
    pdf.setTextColor(30, 41, 59);
    pdf.setFontSize(12);
    pdf.text(`Subject: ${metadata?.title || "Standard DNA Analysis"}`, 40, 140);
    pdf.text(`Sequence Length: ${metadata?.sequenceLength.toLocaleString() || "N/A"} BP`, 40, 150);
    pdf.text(`Generated Date: ${new Date().toLocaleDateString()}`, 40, 160);
    pdf.text(`Security Level: RESEARCH CONFIDENTIAL`, 40, 170);

    // Footer on cover
    pdf.setFontSize(10);
    pdf.setTextColor(148, 163, 184);
    pdf.text("© 2025 GENE FORGE LABS • ANALYTICAL INTELLIGENCE LAYER v4.0.2", pageWidth / 2, pageHeight - 20, { align: 'center' });

    // --- TABLE OF CONTENTS ---
    pdf.addPage();
    pdf.setTextColor(30, 132, 168);
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text("Executive Summary & Contents", 20, 30);

    const sections = [
      { id: "base-count-section", title: "Base Composition & Statistics" },
      { id: "reverse-complement-section", title: "Reverse Complement Synthesis" },
      { id: "amino-acid-section", title: "Polypeptide Translation" },
      { id: "reading-frames-section", title: "Open Reading Frame (ORF) Analysis" },
      { id: "snp-detection-section", title: "Variant & SNP Identification" },
      { id: "motif-search-section", title: "Regulatory Motif Mapping" },
      { id: "restriction-sites-section", title: "Endonuclease Cleavage Map" },
      { id: "gc-content-report", title: "GC Density Profile" },
      { id: "crispr-guides-section", title: "CRISPR-Cas9 Guide Design" },
      { id: "primer-design-section", title: "PCR Primer Optimization" }
    ];

    pdf.setFontSize(12);
    pdf.setTextColor(71, 85, 105);
    pdf.setFont("helvetica", "normal");

    sections.forEach((section, index) => {
      pdf.text(`${index + 1}.`, 20, 55 + (index * 12));
      pdf.text(section.title, 30, 55 + (index * 12));
      pdf.text(`Page 0${index + 3}`, pageWidth - 40, 55 + (index * 12));

      // Subtle dotted line
      pdf.setDrawColor(203, 213, 225);
      pdf.setLineWidth(0.1);
      pdf.line(75, 55 + (index * 12), pageWidth - 45, 55 + (index * 12));
    });

    // --- PROCESS SECTIONS ---
    let renderedSections = 0;

    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (!element) {
        console.warn(`Section element not found: ${section.id}`);
        continue;
      }

      pdf.addPage();
      renderedSections++;

      // Header for each page
      pdf.setFillColor(248, 250, 252);
      pdf.rect(0, 0, pageWidth, 40, 'F');
      pdf.setDrawColor(226, 232, 240);
      pdf.line(0, 40, pageWidth, 40);

      pdf.setTextColor(30, 132, 168);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text(section.title, 20, 25);

      pdf.setFontSize(8);
      pdf.setTextColor(148, 163, 184);
      pdf.text(`GENEFORGE RESEARCH DOSSIER • SEC-ID: ${Math.random().toString(36).substring(7).toUpperCase()}`, 20, 34);

      // Capture section
      // Temporary hide buttons to clean up report
      const buttons = element.querySelectorAll('button');
      buttons.forEach(btn => (btn as HTMLElement).style.visibility = 'hidden');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      // Restore buttons
      buttons.forEach(btn => (btn as HTMLElement).style.visibility = 'visible');

      const imgWidth = pageWidth - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/png');

      // Add image below header
      pdf.addImage(imgData, 'PNG', 20, 50, imgWidth, imgHeight);

      // Page numbering
      const currentPage = pdf.getNumberOfPages();
      pdf.setFontSize(10);
      pdf.setTextColor(148, 163, 184);
      pdf.text(`${currentPage}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    if (renderedSections === 0) {
      console.error('No sections were rendered for the complete report');
      return false;
    }

    pdf.save(`GeneForge_Analysis_${new Date().toISOString().split('T')[0]}.pdf`);
    console.log(`Successfully generated report with ${renderedSections} sections`);
    return true;
  } catch (error) {
    console.error('Error generating enhanced report:', error);
    return false;
  }
};

