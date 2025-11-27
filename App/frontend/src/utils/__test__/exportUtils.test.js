import { describe, test, expect, beforeEach, afterEach, mock } from "bun:test";
import {
    exportToPdf,
    downloadFile,
    exportToMarkDown,
    exportToDocx
} from '../exportUtils';
import { Packer } from 'docx';

const saveAsMock = mock(() => { });
mock.module('file-saver', () => ({
    saveAs: saveAsMock,
}));

describe('exportToPdf', () => {
    let mockWindow;

    beforeEach(() => {
        mockWindow = {
            document: {
                write: mock(() => { }),
                close: mock(() => { }),
            },
            focus: mock(() => { }),
            print: mock(() => { }),
            close: mock(() => { }),
        };

        globalThis.window.open = mock(() => mockWindow);
    });

    test('should  open a new window and trigger print', async () => {
        const html = '<h1>Test Content</h1>';
        exportToPdf(html);

        expect(globalThis.window.open).toHaveBeenCalledWith('', '_blank');

        expect(mockWindow.document.write).toHaveBeenCalled();

        await new Promise(resolve => setTimeout(resolve, 300));

        expect(mockWindow.print).toHaveBeenCalled();
        expect(mockWindow.close).toHaveBeenCalled();
    })

})

describe('downloadFile', () => {
    let mockLink;
    let clickMock;

    beforeEach(() => {
        clickMock = mock(() => { });
        mockLink = {
            href: '',
            download: '',
            click: clickMock,
        };

        globalThis.document.createElement = mock(() => mockLink);
        globalThis.document.body.appendChild = mock(() => { });
        globalThis.document.body.removeChild = mock(() => { });
        globalThis.URL.createObjectURL = mock(() => 'blob:mock-url');
        globalThis.URL.revokeObjectURL = mock(() => { });
    });

    test('should create blob and trigger download', () => {
        const content = 'Test Content';
        const filename = 'test.txt';

        downloadFile(content, filename);

        expect(globalThis.document.createElement).toHaveBeenCalledWith('a');

        expect(mockLink.href).toBe('blob:mock-url');
        expect(mockLink.download).toBe(filename);

        expect(clickMock).toHaveBeenCalled();

        expect(globalThis.document.body.appendChild).toHaveBeenCalled();
        expect(globalThis.document.body.removeChild).toHaveBeenCalled();

        expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
        expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });
});

describe('exportToMarkDown', () => {
    test('should convert HTML to Markdown', () => {
        const html = '<h1>Title</h1><p>Paragraph</p>'
        const result = exportToMarkDown(html)

        expect(result).toContain('# Title')
        expect(result).toContain('Paragraph')
    })

    test('should should handle bold and italic', () => {
        const html = '<strong>Bold</strong><em>Italic</em>'
        const result = exportToMarkDown(html)

        expect(result).toContain('**Bold**')
        expect(result).toContain('_Italic_')
    })

    test('should handle lists', () => {
        const html = '<ul><li>Item 1</li><li>Item 2</li></ul>'
        const result = exportToMarkDown(html)

        expect(result).toContain('*   Item 1\n*   Item 2')
    })

    test('should handle code blocks', () => {
        const html = '<pre><code>const x = 1;</code></pre>'
        const result = exportToMarkDown(html)

        expect(result).toContain('```')
        expect(result).toContain('const x = 1;')
    })

});

describe('exportToDocx', () => {
    let mockBlob;
    let packTooBlobMock;

    beforeEach(() => {
        mockBlob = new Blob(['mock docx content']);

        packTooBlobMock = mock(async () => mockBlob);
        Packer.toBlob = packTooBlobMock;

        saveAsMock.mockClear();
    });

    afterEach(() => {
        delete Packer.toBlob;
    });

    test('should convert HTML to DOCX and save', async () => {
        const html = '<h1>Title</h1><p>Content</p>';
        const noteTitle = 'test.docx';

        await exportToDocx(html, noteTitle);

        expect(packTooBlobMock).toHaveBeenCalled();
        expect(saveAsMock).toHaveBeenCalledWith(mockBlob, noteTitle);
    });

    test('should handle different HTML elements', async () => {
        const html = '<p><strong>Bold</strong> <em>Italic</em></p><ul><li>Item</li></ul>';
        await exportToDocx(html, 'test.docx');

        expect(packTooBlobMock).toHaveBeenCalled();
        expect(saveAsMock).toHaveBeenCalled();
    });
});