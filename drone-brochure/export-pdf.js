/**
 * Export A4 print brochure to PDF (2 pages, front & back)
 * Usage: npx electron drone-brochure/export-pdf.js
 */
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

const OUTPUT = path.join(__dirname, '无人机产品手册-A4.pdf');

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 900,
    height: 1300,
    show: false,
    webPreferences: { backgroundThrottling: false },
  });

  await win.loadFile(path.join(__dirname, 'print-a4.html'));
  await new Promise((r) => setTimeout(r, 1200));

  const pdf = await win.webContents.printToPDF({
    printBackground: true,
    preferCSSPageSize: true,
    pageSize: 'A4',
    margins: { marginType: 'none' },
  });

  fs.writeFileSync(OUTPUT, pdf);
  console.log('PDF exported:', OUTPUT);
  console.log('Pages: 1 (A4 single page, dark theme)');

  app.quit();
});

app.on('window-all-closed', () => app.quit());
