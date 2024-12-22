import jsPDF from 'jspdf';

export const generatePdfFromContent = (
  title: string,
  summary: string,
  content: string,
  isYoutube: boolean = false
) => {
  const doc = new jsPDF();
  const lineHeight = 10;
  let currentY = 20;

  // Add title
  doc.setFontSize(24);
  doc.text(title, 20, currentY);
  currentY += lineHeight * 2;

  // Add executive summary section
  doc.setFontSize(18);
  doc.text('Executive Summary', 20, currentY);
  currentY += lineHeight;

  // Add summary content with bullet points
  doc.setFontSize(12);
  const summaryPoints = summary
    .split(". ")
    .filter(point => point.length > 0)
    .map(point => "• " + point.trim() + (point.endsWith(".") ? "" : "."));

  summaryPoints.forEach(point => {
    const splitPoint = doc.splitTextToSize(point, 170);
    doc.text(splitPoint, 20, currentY);
    currentY += (splitPoint.length * lineHeight);
  });

  currentY += lineHeight;

  // Add detailed content section
  doc.setFontSize(18);
  doc.text('Detailed Content', 20, currentY);
  currentY += lineHeight * 1.5;

  // Split content into paragraphs
  doc.setFontSize(12);
  const paragraphs = content.split(isYoutube ? /(?<=[.!?])\s+/g : ". ")
    .filter(para => para.trim().length > 0)
    .map(para => para.trim() + (para.endsWith(".") ? "" : "."));

  paragraphs.forEach(para => {
    // Check if we need a new page
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    const splitPara = doc.splitTextToSize(para, 170);
    doc.text(splitPara, 20, currentY);
    currentY += (splitPara.length * lineHeight) + (lineHeight / 2);
  });

  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};