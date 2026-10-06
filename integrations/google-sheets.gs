/**
 * Collect landing-page leads into this Google Sheet.
 *
 * 1. Open your Google Sheet → Extensions → Apps Script.
 * 2. Delete what's there, paste this whole file, click Save.
 * 3. Deploy → New deployment → gear icon → "Web app"
 *      Execute as: Me   ·   Who has access: Anyone
 *    Click Deploy and allow access when Google asks.
 * 4. Copy the Web app URL (ends in /exec) into `leadWebhookUrl` in assets/config.js.
 *
 * Every form submission on the page becomes one row in the "Leads" tab.
 * If you change this script later: Deploy → Manage deployments → Edit → Version: New version.
 */

var SHEET_NAME = "Leads";
var TIME_ZONE = "Asia/Dubai";

// Column order in the sheet. Fields the page sends that aren't listed here are
// added as extra columns at the end.
var COLUMNS = [
  ["submitted_at", "Submitted (Dubai time)"],
  ["form", "Form"],
  ["option", "Ticket / table"],
  ["name", "Name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["guests", "Guests"],
  ["notes", "Notes"],
  ["consent", "Marketing consent"],
  ["utm_source", "utm_source"],
  ["utm_medium", "utm_medium"],
  ["utm_campaign", "utm_campaign"],
  ["utm_content", "utm_content"],
  ["utm_term", "utm_term"],
  ["fbclid", "fbclid"],
  ["event", "Event"],
  ["page", "Page"],
  ["user_agent", "Device"],
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();

    var keys = COLUMNS.map(function (c) { return c[0]; });
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    Object.keys(data).forEach(function (k) {
      if (keys.indexOf(k) === -1 && headers.indexOf(k) === -1) {
        headers.push(k);
        sheet.getRange(1, headers.length).setValue(k).setFontWeight("bold");
      }
    });

    if (data.submitted_at) {
      data.submitted_at = Utilities.formatDate(new Date(data.submitted_at), TIME_ZONE, "yyyy-MM-dd HH:mm:ss");
    }

    var labels = COLUMNS.map(function (c) { return c[1]; });
    var row = headers.map(function (h) {
      var i = labels.indexOf(h);
      var v = data[i === -1 ? h : keys[i]];
      return safe_(v);
    });
    sheet.appendRow(row);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Visiting the web-app URL in a browser shows this, to confirm it's deployed.
function doGet() {
  return json_({ ok: true, message: "Lead collector is running." });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME, 0);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS.map(function (c) { return c[1]; }));
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Store everything as plain text: stops "+971..." becoming a formula/number
// and stops anyone injecting a spreadsheet formula through the form.
function safe_(v) {
  if (v === undefined || v === null) return "";
  v = String(v);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
