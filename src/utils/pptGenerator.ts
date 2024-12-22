import pptxgen from "pptxgenjs";

export const generatePresentationFromContent = async (
  title: string,
  summary: string,
  fullText: string,
  isYoutube: boolean = false
) => {
  const pres = new pptxgen();

  // Title slide
  const titleSlide = pres.addSlide();
  titleSlide.addText(title, {
    x: 1,
    y: 1,
    w: "80%",
    h: 1.5,
    fontSize: 36,
    color: "363636",
    bold: true,
    align: "center",
  });

  // Summary slide
  const summarySlide = pres.addSlide();
  summarySlide.addText("Executive Summary", {
    x: 1,
    y: 0.5,
    fontSize: 24,
    color: "363636",
    bold: true,
  });

  // Split summary into bullet points and format them as TextProps[]
  const summaryPoints = summary
    .split(". ")
    .filter(point => point.length > 0)
    .map(point => ({
      text: point.trim() + (point.endsWith(".") ? "" : "."),
      options: {
        bullet: true,
        fontSize: 14,
        color: "666666",
      }
    }));

  summarySlide.addText(summaryPoints, {
    x: 1,
    y: 1.5,
    w: "80%",
    h: 4,
  });

  // Key Points slides
  const contentChunks = fullText
    .split(isYoutube ? /(?<=[.!?])\s+/g : ". ")
    .reduce((acc: string[], sentence) => {
      if (!sentence.trim()) return acc;
      const lastChunk = acc[acc.length - 1];
      if (!lastChunk || lastChunk.length + sentence.length > 200) {
        acc.push(sentence.trim());
      } else {
        acc[acc.length - 1] = `${lastChunk} ${sentence.trim()}`;
      }
      return acc;
    }, []);

  // Group content into sections
  const sections = [];
  let currentSection: string[] = [];
  
  contentChunks.forEach((chunk, index) => {
    currentSection.push(chunk);
    if (currentSection.length === 3 || index === contentChunks.length - 1) {
      sections.push([...currentSection]);
      currentSection = [];
    }
  });

  sections.forEach((section, index) => {
    const contentSlide = pres.addSlide();
    contentSlide.addText(`Key Points - Part ${index + 1}`, {
      x: 1,
      y: 0.5,
      fontSize: 24,
      color: "363636",
      bold: true,
    });

    // Format content points as TextProps[]
    const contentPoints = section.map(point => ({
      text: point.trim() + (point.endsWith(".") ? "" : "."),
      options: {
        bullet: true,
        fontSize: 14,
        color: "666666",
      }
    }));

    contentSlide.addText(contentPoints, {
      x: 1,
      y: 1.5,
      w: "80%",
      h: 4,
    });
  });

  // Save the presentation
  await pres.writeFile({ fileName: `${title.replace(/[^a-z0-9]/gi, '_')}.pptx` });
};