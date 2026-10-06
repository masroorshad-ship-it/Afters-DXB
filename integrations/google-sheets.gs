/**
 * Collect landing-page leads into a Google Sheet.
 *
 * 1. Create a Google Sheet → Extensions → Apps Script.
 * 2. Paste this file, Save.
 * 3. Deploy → New deployment → type "Web app"
 *      Execute as: Me   ·   Who has access: Anyone
 * 4. Copy the Web app URL into `leadWebhookUrl` in assets/config.js.
 *
 * Each form submission becomes one row. New fields get new columns automatically.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads")
      || SpreadsheetApp.getActiveSpreadsheet().insertSheet("Leads");
    var data = JSON.parse(e.postData.contents);

    var headers = sheet.getLastColumn() ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
    Object.keys(data).forEach(function (k) {
      if (headers.indexOf(k) === -1) headers.push(k);
    });
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
    sheet.appendRow(headers.map(function (h) { return data[h] == null ? "" : data[h]; }));

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
