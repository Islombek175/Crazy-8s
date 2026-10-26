import { jsPDF } from 'jspdf';
import type { Session } from '../types';

/**
 * Downloads a structured JSON backup of the session
 */
export function exportSessionAsJSON(session: Session) {
  const json = JSON.stringify(session, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeTitle = session.challenge.replace(/[^a-z0-9]/gi, '-').toLowerCase().slice(0, 30) || 'session';
  a.download = `eight-crazy8s-${safeTitle}-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exports all 8 panels as a single high-resolution composite PNG image
 */
export async function exportSessionAsPNG(session: Session): Promise<void> {
  const width = 2400;
  const height = 1550;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background warm ivory
  ctx.fillStyle = '#F8F7F2';
  ctx.fillRect(0, 0, width, height);

  // Top header border
  ctx.strokeStyle = '#D8D6CE';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // Brand Header
  ctx.fillStyle = '#171717';
  ctx.font = '600 42px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('EIGHT', 70, 95);

  ctx.font = '500 16px "IBM Plex Mono", monospace';
  ctx.fillStyle = '#77756F';
  ctx.fillText('CRAZY 8s BRAINSTORMING WORKSHEET', 230, 93);

  // Challenge title
  ctx.font = '600 24px "Source Sans 3", sans-serif';
  ctx.fillStyle = '#171717';
  const challengeText = `Challenge: "${session.challenge}"`;
  ctx.fillText(challengeText.length > 90 ? challengeText.slice(0, 87) + '...' : challengeText, 70, 140);

  // Metadata date & duration
  const dateFormatted = new Date(session.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const durationMin = Math.round(session.durationSeconds / 60);
  ctx.font = '400 15px "IBM Plex Mono", monospace';
  ctx.fillStyle = '#77756F';
  ctx.textAlign = 'right';
  ctx.fillText(`DURATION: ${durationMin} MIN  |  DATE: ${dateFormatted}`, width - 70, 93);
  ctx.textAlign = 'left';

  // Divider line
  ctx.beginPath();
  ctx.moveTo(70, 165);
  ctx.lineTo(width - 70, 165);
  ctx.strokeStyle = '#D8D6CE';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Draw 8 panels: 4 cols x 2 rows
  const gridX = 70;
  const gridY = 190;
  const totalGridW = width - 140;
  const totalGridH = height - 250;
  const gap = 20;

  const colW = (totalGridW - gap * 3) / 4;
  const rowH = (totalGridH - gap) / 2;

  // Load all idea canvas images in parallel
  const imagePromises = session.ideas.map((idea) => {
    return new Promise<HTMLImageElement | null>((resolve) => {
      if (!idea.canvasData) {
        resolve(null);
        return;
      }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = idea.canvasData;
    });
  });

  const loadedImages = await Promise.all(imagePromises);

  for (let idx = 0; idx < 8; idx++) {
    const col = idx % 4;
    const row = Math.floor(idx / 4);
    const px = gridX + col * (colW + gap);
    const py = gridY + row * (rowH + gap);

    const idea = session.ideas[idx] || {
      id: idx + 1,
      title: '',
      description: '',
      bulletPoints: [],
      canvasData: null,
      isFavorite: false,
    };

    // Card background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(px, py, colW, rowH);

    // Card border
    ctx.strokeStyle = idea.isFavorite ? '#171717' : '#D8D6CE';
    ctx.lineWidth = idea.isFavorite ? 3 : 1.5;
    ctx.strokeRect(px, py, colW, rowH);

    // Card Header Bar
    ctx.fillStyle = '#F0EFE9';
    ctx.fillRect(px, py, colW, 40);
    ctx.strokeStyle = '#D8D6CE';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px, py + 40);
    ctx.lineTo(px + colW, py + 40);
    ctx.stroke();

    // Number
    ctx.fillStyle = '#171717';
    ctx.font = '600 16px "IBM Plex Mono", monospace';
    ctx.fillText(String(idea.id).padStart(2, '0'), px + 12, py + 25);

    // Title
    const titleText = idea.title ? idea.title : `Idea ${idea.id}`;
    ctx.font = '600 15px "Source Sans 3", sans-serif';
    ctx.fillText(titleText.length > 25 ? titleText.slice(0, 23) + '...' : titleText, px + 48, py + 25);

    // Star if favorite
    if (idea.isFavorite) {
      ctx.fillStyle = '#171717';
      ctx.font = '16px sans-serif';
      ctx.fillText('★ FAVORITE', px + colW - 95, py + 25);
    }

    // Body content: Drawing or Written text
    const img = loadedImages[idx];
    const bodyY = py + 40;
    const bodyH = rowH - 40;

    if (img) {
      // Draw image preserving aspect ratio
      const padding = 12;
      const availW = colW - padding * 2;
      const availH = bodyH - padding * 2;
      const scale = Math.min(availW / img.width, availH / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = px + padding + (availW - dw) / 2;
      const dy = bodyY + padding + (availH - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    } else if (idea.description || idea.bulletPoints.length > 0) {
      // Draw written content
      ctx.fillStyle = '#171717';
      ctx.font = '15px "Source Sans 3", sans-serif';
      let textY = bodyY + 30;

      if (idea.description) {
        const words = idea.description.split(' ');
        let line = '';
        for (const w of words) {
          const testLine = line + w + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > colW - 30) {
            ctx.fillText(line, px + 15, textY);
            line = w + ' ';
            textY += 22;
            if (textY > bodyY + bodyH - 30) break;
          } else {
            line = testLine;
          }
        }
        if (line && textY <= bodyY + bodyH - 20) {
          ctx.fillText(line, px + 15, textY);
          textY += 25;
        }
      }

      // Draw bullets
      if (idea.bulletPoints && textY <= bodyY + bodyH - 30) {
        ctx.fillStyle = '#77756F';
        ctx.font = '14px "Source Sans 3", sans-serif';
        for (const b of idea.bulletPoints) {
          if (!b.trim()) continue;
          ctx.fillText(`• ${b}`, px + 18, textY);
          textY += 20;
          if (textY > bodyY + bodyH - 15) break;
        }
      }
    } else {
      // Empty placeholder
      ctx.fillStyle = '#77756F';
      ctx.font = 'italic 14px "Source Sans 3", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('(Blank idea space)', px + colW / 2, bodyY + bodyH / 2);
      ctx.textAlign = 'left';
    }
  }

  // Trigger download
  const safeTitle = session.challenge.replace(/[^a-z0-9]/gi, '-').toLowerCase().slice(0, 30) || 'crazy8s';
  const dataURL = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = `eight-crazy8s-${safeTitle}-${Date.now()}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Exports complete session as a printable, publication-grade PDF using jsPDF
 */
export async function exportSessionAsPDF(session: Session): Promise<void> {
  // A4 Landscape: 297mm x 210mm
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 297;
  const pageHeight = 210;

  // Background
  doc.setFillColor(248, 247, 242);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer border
  doc.setDrawColor(216, 214, 206);
  doc.setLineWidth(0.4);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16, 'S');

  // Header Title
  doc.setTextColor(23, 23, 23);
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.text('EIGHT', 14, 18);

  doc.setFont('courier', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(119, 117, 111);
  doc.text('CRAZY 8s BRAINSTORMING WORKSHEET', 42, 17.5);

  const durationMin = Math.round(session.durationSeconds / 60);
  const dateFormatted = new Date(session.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  doc.text(`DURATION: ${durationMin} MIN  |  DATE: ${dateFormatted}`, pageWidth - 14, 17.5, { align: 'right' });

  // Divider
  doc.setDrawColor(216, 214, 206);
  doc.setLineWidth(0.3);
  doc.line(14, 22, pageWidth - 14, 22);

  // Challenge text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(23, 23, 23);
  const challengeLabel = `Challenge: "${session.challenge}"`;
  doc.text(challengeLabel.length > 110 ? challengeLabel.slice(0, 107) + '...' : challengeLabel, 14, 28);

  if (session.context) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(119, 117, 111);
    const contextLabel = `Context: ${session.context}`;
    doc.text(contextLabel.length > 120 ? contextLabel.slice(0, 117) + '...' : contextLabel, 14, 33);
  }

  // 8 Grid Panels (4 columns x 2 rows)
  const gridStartY = session.context ? 36 : 32;
  const marginX = 14;
  const gridW = pageWidth - marginX * 2;
  const gridH = pageHeight - gridStartY - 14;
  const gap = 3.5;
  const colW = (gridW - gap * 3) / 4;
  const rowH = (gridH - gap) / 2;

  // Load image drawings
  const imagePromises = session.ideas.map((idea) => {
    return new Promise<string | null>((resolve) => {
      if (!idea.canvasData) {
        resolve(null);
        return;
      }
      resolve(idea.canvasData);
    });
  });

  const canvasDataList = await Promise.all(imagePromises);

  for (let idx = 0; idx < 8; idx++) {
    const col = idx % 4;
    const row = Math.floor(idx / 4);
    const px = marginX + col * (colW + gap);
    const py = gridStartY + row * (rowH + gap);

    const idea = session.ideas[idx] || {
      id: idx + 1,
      title: '',
      description: '',
      bulletPoints: [],
      isFavorite: false,
    };

    // Panel background
    doc.setFillColor(255, 255, 255);
    doc.rect(px, py, colW, rowH, 'F');

    // Panel border
    if (idea.isFavorite) {
      doc.setDrawColor(23, 23, 23);
      doc.setLineWidth(0.6);
    } else {
      doc.setDrawColor(216, 214, 206);
      doc.setLineWidth(0.3);
    }
    doc.rect(px, py, colW, rowH, 'S');

    // Header strip
    doc.setFillColor(240, 239, 233);
    doc.rect(px, py, colW, 7, 'F');
    doc.setDrawColor(216, 214, 206);
    doc.line(px, py + 7, px + colW, py + 7);

    // Number
    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(23, 23, 23);
    doc.text(String(idea.id).padStart(2, '0'), px + 2.5, py + 5);

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    const title = idea.title || `Idea ${idea.id}`;
    doc.text(title.length > 20 ? title.slice(0, 18) + '..' : title, px + 9.5, py + 5);

    // Favorite indicator
    if (idea.isFavorite) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(23, 23, 23);
      doc.text('★ FAVORITE', px + colW - 2.5, py + 5, { align: 'right' });
    }

    // Content: drawing or text
    const dataUrl = canvasDataList[idx];
    const bodyY = py + 8;
    const bodyH = rowH - 9;

    if (dataUrl) {
      try {
        doc.addImage(dataUrl, 'PNG', px + 2, bodyY + 1, colW - 4, bodyH - 2);
      } catch (err) {
        console.warn('Could not add image to PDF', err);
      }
    } else if (idea.description || (idea.bulletPoints && idea.bulletPoints.length > 0)) {
      doc.setTextColor(23, 23, 23);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);

      let textY = bodyY + 4;
      if (idea.description) {
        const splitText = doc.splitTextToSize(idea.description, colW - 5);
        for (const line of splitText) {
          if (textY < bodyY + bodyH - 4) {
            doc.text(line, px + 3, textY);
            textY += 3.5;
          }
        }
      }

      if (idea.bulletPoints) {
        doc.setTextColor(119, 117, 111);
        for (const b of idea.bulletPoints) {
          if (!b.trim()) continue;
          if (textY < bodyY + bodyH - 3) {
            const splitBullet = doc.splitTextToSize(`• ${b}`, colW - 6);
            for (const bline of splitBullet) {
              doc.text(bline, px + 3.5, textY);
              textY += 3.2;
            }
          }
        }
      }
    } else {
      doc.setTextColor(160, 160, 155);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.text('(No content sketched)', px + colW / 2, bodyY + bodyH / 2, { align: 'center' });
    }
  }

  // If there are reflections or notes, add a second page
  const hasReflections = session.reflections.surprise || session.reflections.potential || session.reflections.nextStep;
  const hasNotes = session.ideas.some((i) => i.notes && i.notes.trim());

  if (hasReflections || hasNotes) {
    doc.addPage('a4', 'portrait');
    const p2W = 210;
    const p2H = 297;

    // Background
    doc.setFillColor(248, 247, 242);
    doc.rect(0, 0, p2W, p2H, 'F');

    // Border
    doc.setDrawColor(216, 214, 206);
    doc.setLineWidth(0.4);
    doc.rect(10, 10, p2W - 20, p2H - 20, 'S');

    // Header
    doc.setTextColor(23, 23, 23);
    doc.setFont('times', 'bold');
    doc.setFontSize(20);
    doc.text('EIGHT — SESSION REFLECTIONS', 18, 24);

    doc.setFont('courier', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(119, 117, 111);
    doc.text(`Challenge: ${session.challenge}`, 18, 31);

    doc.setDrawColor(216, 214, 206);
    doc.line(18, 36, p2W - 18, 36);

    let curY = 46;

    if (hasReflections) {
      doc.setFont('times', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(23, 23, 23);
      doc.text('Synthesis & Observations', 18, curY);
      curY += 8;

      const questions = [
        { q: '1. Which idea surprised you the most?', a: session.reflections.surprise },
        { q: '2. Which idea has the greatest potential?', a: session.reflections.potential },
        { q: '3. What would you like to explore next?', a: session.reflections.nextStep },
      ];

      for (const item of questions) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(23, 23, 23);
        doc.text(item.q, 18, curY);
        curY += 5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(60, 60, 60);
        const ans = item.a || '(No response recorded)';
        const lines = doc.splitTextToSize(ans, p2W - 36);
        doc.text(lines, 18, curY);
        curY += lines.length * 5 + 6;
      }
    }

    if (hasNotes) {
      curY += 4;
      doc.setFont('times', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(23, 23, 23);
      doc.text('Individual Idea Notes', 18, curY);
      curY += 8;

      for (const idea of session.ideas) {
        if (!idea.notes || !idea.notes.trim()) continue;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(23, 23, 23);
        doc.text(`Idea ${String(idea.id).padStart(2, '0')}${idea.title ? ` — ${idea.title}` : ''}:`, 18, curY);
        curY += 4.5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        const lines = doc.splitTextToSize(idea.notes, p2W - 36);
        doc.text(lines, 18, curY);
        curY += lines.length * 4.5 + 4;
      }
    }
  }

  const safeTitle = session.challenge.replace(/[^a-z0-9]/gi, '-').toLowerCase().slice(0, 30) || 'crazy8s';
  doc.save(`eight-crazy8s-${safeTitle}-${Date.now()}.pdf`);
}
