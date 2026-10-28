/**
 * ============================================================================
 * GOOGLE APPS SCRIPT FOR WEDDING RSVP (Harsh & Monika)
 * ============================================================================
 * 
 * INSTRUCTIONS:
 * 1. Open Google Sheets (https://sheets.new) and name it: "Harsh & Monika Wedding RSVPs"
 * 2. In Google Sheets menu, click: Extensions > Apps Script
 * 3. Delete any code in the script editor and paste this entire file content.
 * 4. Click the Save icon (Floppy disk).
 * 5. Click "Deploy" (top right blue button) > "New deployment".
 * 6. Under "Select type" (gear icon), select "Web app".
 * 7. Set:
 *    - Description: "Wedding RSVP Collector"
 *    - Execute as: "Me" (your email)
 *    - Who has access: "Anyone" (VERY IMPORTANT: must be "Anyone" so guests can submit without Google login)
 * 8. Click "Deploy", approve permissions if prompted.
 * 9. Copy the generated "Web App URL" (ends in `/exec`).
 * 10. Open `script.js` in your website code and set:
 *     CONFIG.googleSheetsRsvpUrl = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
 * 
 * ============================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 30 seconds for concurrent requests to prevent row overwriting
  lock.tryLock(30000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Ensure header row exists on first run
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp (IST)",
        "Guest Name",
        "Phone / Email",
        "Attendance Status",
        "Total Guests",
        "Blessing / Message",
        "Submission Source"
      ]);
      // Format header row with Royal Blue & Gold
      var headerRange = sheet.getRange(1, 1, 1, 7);
      headerRange.setBackground("#0B2559");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    var data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }

    // Format IST timestamp
    var istTimestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");

    var row = [
      istTimestamp,
      data.guestName || "Anonymous Guest",
      data.contactInfo || "Not Provided",
      data.attendance === "accept" ? "Joyfully Accept (उपस्थित होंगे)" : "Regretfully Decline (असमर्थ)",
      data.guestsCount || 1,
      data.message || "",
      data.source || "Website RSVP Form"
    ];

    sheet.appendRow(row);

    // Color code the attendance cell for quick glance
    var lastRow = sheet.getLastRow();
    var attendanceCell = sheet.getRange(lastRow, 4);
    if (data.attendance === "accept") {
      attendanceCell.setBackground("#E6F4EA"); // soft green
      attendanceCell.setFontColor("#137333");
    } else {
      attendanceCell.setBackground("#FCE8E6"); // soft red
      attendanceCell.setFontColor("#C5221F");
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", row: lastRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "active", message: "Harsh & Monika Wedding RSVP Endpoint is operational." }))
    .setMimeType(ContentService.MimeType.JSON);
}

