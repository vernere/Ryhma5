import { Document, Paragraph, TextRun, HeadingLevel, Packer } from "docx";
import { saveAs } from "file-saver";
import TurndownService from "turndown";

export const exportToPdf = (html) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Export PDF</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        padding: 20px;
                        max-width: 800px;
                        margin: 0 auto;
                    }
                </style>
            </head>
            <body>
                ${html}
            </body>
        </html>
    `)

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250)
}

export const exportToTxt = (html) => {
    const text = html.replaceAll(/<[^>]*>/g, '') // Remove HTML tags
        .replaceAll(/&nbsp;/g, ' ')   // Replace &nbsp; with spaces
        .replaceAll(/\n\s*\n/g, '\n') // Remove extra newlines
        .trim();
    return text;
};

export const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const exportToMarkDown = (html) => {
    const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced'
    });
    return turndownService.turndown(html);
};

export const exportToDocx = async (html, noteTitle) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const paragraphs = [];

    const processNode = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            return new TextRun({
                text: node.textContent,
            });
        }

        const runs = [];
        node.childNodes.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                runs.push(new TextRun({ text: child.textContent }));
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                switch (child.tagName.toLowerCase()) {
                    case 'strong':
                    case 'b':
                        runs.push(new TextRun({
                            text: child.textContent,
                            bold: true,
                        }));
                        break;
                    case 'em':
                    case 'i':
                        runs.push(new TextRun({
                            text: child.textContent,
                            italics: true,
                        }));
                        break;
                    case 'li':
                        // Handle list items recursively
                        const listItemRuns = processNode(child);
                        runs.push(...listItemRuns);
                        break;
                    default:
                        runs.push(new TextRun({
                            text: child.textContent,
                        }));
                }
            }
        });
        return runs;
    };

    doc.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, ul, ol').forEach(element => {
        if (element.tagName.toLowerCase() === 'ul' || element.tagName.toLowerCase() === 'ol') {
            // Process list items
            element.querySelectorAll('li').forEach((li, index) => {
                const runs = processNode(li);
                const paragraph = new Paragraph({
                    children: runs.flat(),
                    bullet: {
                        level: 0 // Default to level 0 for now
                    },
                    numbering: element.tagName.toLowerCase() === 'ol' ? {
                        reference: 1, // Use numbering reference 1 for ordered lists
                        level: 0,
                    } : undefined,
                });
                paragraphs.push(paragraph);
            });
        } else {
            const runs = processNode(element);
            const paragraph = new Paragraph({
                children: runs.flat(),
                heading: element.tagName.toLowerCase().startsWith('h')
                    ? HeadingLevel[element.tagName.toUpperCase()]
                    : undefined,
            });
            paragraphs.push(paragraph);
        }
    });

    const docx = new Document({
        numbering: {
            config: [{
                reference: 1,
                levels: [
                    {
                        level: 0,
                        format: "decimal",
                        text: "%1.",
                        alignment: "start",
                        style: {
                            paragraph: {
                                indent: { left: 720, hanging: 260 }
                            }
                        }
                    }
                ]
            }]
        },
        sections: [{
            properties: {},
            children: paragraphs,
        }],
    });

    const blob = await Packer.toBlob(docx);
    saveAs(blob, noteTitle)
};