/**
 * Quản lý khách mời — Quốc Anh & Diệp Khanh
 *
 * Dán toàn bộ file này vào Extensions → Apps Script của Google Sheet.
 * Hướng dẫn đầy đủ: docs/guest-management-google-sheets.md
 *
 * Sheet "Guests Management" có 9 cột:
 *   A No · B Name · C Invitation type · D Slug · E Link
 *   F Attending · G Number · H Other name · I Note
 *
 * Cô dâu chú rể chỉ điền B và C. Menu "💌 Wedding → Tạo slug + link" sinh ra
 * A, D, E. Khách mở link, trả lời form, và script ghi ngược F–I vào ĐÚNG dòng
 * của khách đó (tìm theo slug) chứ không thêm dòng mới.
 */

// ⚠️ Sửa thành domain thật của web cưới, KHÔNG có dấu / ở cuối.
const SITE_URL = 'https://quocanh-diepkhanh.vercel.app';

const SHEET_NAME = 'Guests Management';

// Số thứ tự cột, đếm từ 1
const COL = {
  no: 1,
  name: 2,
  type: 3,
  slug: 4,
  link: 5,
  attending: 6,
  number: 7,
  otherName: 8,
  note: 9,
};

const FIRST_ROW = 2; // hàng 1 là tiêu đề

/* ────────────────────────────────────────────────────────────────────────────
   Menu trong Sheet
   ──────────────────────────────────────────────────────────────────────── */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('💌 Wedding')
    .addItem('Tạo slug + link cho khách mới', 'generateLinks')
    .addItem('Tạo lại slug + link cho dòng đang chọn', 'regenerateSelectedRows')
    .addSeparator()
    .addItem('Xoá câu trả lời của dòng đang chọn', 'clearSelectedResponses')
    .addToUi();
}

/** Sinh slug + link cho mọi dòng đã có Name và Invitation type mà chưa có slug */
function generateLinks() {
  const result = fillRows_(function (row) {
    return !row.slug;
  });
  toast_(result.done + ' khách đã có link mới. Bỏ qua ' + result.skipped + ' dòng.');
}

/** Ép sinh lại cho các dòng đang bôi đen — dùng khi sửa tên khách */
function regenerateSelectedRows() {
  const rows = selectedRowNumbers_();
  if (!rows.length) {
    toast_('Bôi đen ít nhất một dòng khách trước đã nha.');
    return;
  }
  const result = fillRows_(function (row) {
    return rows.indexOf(row.rowNumber) !== -1;
  }, true);
  toast_('Đã tạo lại link cho ' + result.done + ' khách.');
}

/** Xoá F–I để mời lại từ đầu */
function clearSelectedResponses() {
  const sheet = guestSheet_();
  const rows = selectedRowNumbers_();
  rows.forEach(function (rowNumber) {
    sheet.getRange(rowNumber, COL.attending, 1, 4).clearContent();
  });
  toast_('Đã xoá câu trả lời của ' + rows.length + ' dòng.');
}

/* ────────────────────────────────────────────────────────────────────────────
   Web app: trang cưới gọi vào đây
   ──────────────────────────────────────────────────────────────────────── */

/**
 * GET ?slug=abc → { ok: true, name: 'Nguyễn Văn A', type: 'intimate' }
 * Trang cưới dùng để hiện "Dear <tên khách>" và quyết định có cho xem tiệc
 * chiều hay không.
 */
function doGet(e) {
  const slug = e && e.parameter ? String(e.parameter.slug || '').trim() : '';
  if (!slug) return json_({ ok: false, error: 'missing slug' });

  const found = findBySlug_(slug);
  if (!found) return json_({ ok: false, error: 'not found' });

  return json_({
    ok: true,
    name: found.name,
    type: normalizeType_(found.type),
  });
}

/**
 * POST { slug, name, attending, companions, companionNames, note }
 * Có slug → ghi đè F–I của đúng dòng đó.
 * Không có slug (khách vào thẳng trang chủ) → thêm một dòng mới ở cuối.
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = guestSheet_();

    const attending = data.attending === 'yes' ? 'Có' : 'Không';
    const number = data.attending === 'yes' ? Number(data.companions || 0) : 0;
    const others = data.companionNames || '';
    const note = data.note || '';

    const slug = String(data.slug || '').trim();
    const found = slug ? findBySlug_(slug) : null;

    if (found) {
      sheet
        .getRange(found.rowNumber, COL.attending, 1, 4)
        .setValues([[attending, number, others, note]]);
    } else {
      // Khách lạ: vẫn ghi lại để không mất câu trả lời nào
      const rowNumber = sheet.getLastRow() + 1;
      sheet.getRange(rowNumber, COL.no).setValue(rowNumber - FIRST_ROW + 1);
      sheet.getRange(rowNumber, COL.name).setValue(data.name || '(không rõ tên)');
      sheet.getRange(rowNumber, COL.type).setValue('general');
      sheet
        .getRange(rowNumber, COL.attending, 1, 4)
        .setValues([[attending, number, others, note]]);
    }

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/* ────────────────────────────────────────────────────────────────────────────
   Bên trong
   ──────────────────────────────────────────────────────────────────────── */

function guestSheet_() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Không thấy sheet tên "' + SHEET_NAME + '"');
  return sheet;
}

/** Đọc toàn bộ vùng khách một lần — nhanh hơn nhiều so với đọc từng ô */
function readGuests_() {
  const sheet = guestSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < FIRST_ROW) return [];

  const values = sheet.getRange(FIRST_ROW, 1, lastRow - FIRST_ROW + 1, COL.note).getValues();
  return values.map(function (row, i) {
    return {
      rowNumber: FIRST_ROW + i,
      name: String(row[COL.name - 1] || '').trim(),
      type: String(row[COL.type - 1] || '').trim(),
      slug: String(row[COL.slug - 1] || '').trim(),
    };
  });
}

function findBySlug_(slug) {
  const wanted = slug.toLowerCase();
  const guests = readGuests_();
  for (let i = 0; i < guests.length; i += 1) {
    if (guests[i].slug.toLowerCase() === wanted) return guests[i];
  }
  return null;
}

/**
 * Điền No + Slug + Link cho những dòng thoả `shouldFill`.
 * Ghi cả khối một lần ở cuối thay vì setValue từng ô — Sheet nhiều trăm dòng
 * mà ghi lẻ thì Apps Script hết thời gian chạy.
 */
function fillRows_(shouldFill, force) {
  const sheet = guestSheet_();
  const guests = readGuests_();
  if (!guests.length) return { done: 0, skipped: 0 };

  // Đọc nguyên khối A–E rồi sửa trong bộ nhớ: ghi từng ô một thì Sheet vài trăm
  // dòng sẽ chạy quá thời gian cho phép của Apps Script.
  const block = sheet.getRange(FIRST_ROW, COL.no, guests.length, COL.link).getValues();

  // Slug đã dùng, để hai khách trùng tên không đè lên nhau
  const taken = {};
  guests.forEach(function (g) {
    if (g.slug && !(force && shouldFill(g))) taken[g.slug.toLowerCase()] = true;
  });

  let done = 0;
  let skipped = 0;

  guests.forEach(function (g, i) {
    if (!g.name) return; // dòng trống ở cuối sheet, bỏ qua im lặng

    block[i][COL.no - 1] = i + 1;

    if (!g.type || !shouldFill(g)) {
      skipped += 1;
      return;
    }

    const slug = uniqueSlug_(g.name, taken);
    taken[slug] = true;

    block[i][COL.slug - 1] = slug;
    block[i][COL.link - 1] = SITE_URL + '/?to=' + slug;
    done += 1;
  });

  sheet.getRange(FIRST_ROW, COL.no, guests.length, COL.link).setValues(block);
  return { done: done, skipped: skipped };
}

/** "Nguyễn Văn A" → "nguyen-van-a"; trùng thì thêm -2, -3… */
function uniqueSlug_(name, taken) {
  const base = slugify_(name) || 'khach';
  if (!taken[base]) return base;

  let n = 2;
  while (taken[base + '-' + n]) n += 1;
  return base + '-' + n;
}

function slugify_(text) {
  return String(text)
    .normalize('NFD')
    // Bỏ dấu tiếng Việt; chữ đ/Đ không có dạng tổ hợp nên phải thay riêng
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeType_(type) {
  return slugify_(type).indexOf('intimate') === 0 ? 'intimate' : 'general';
}

function selectedRowNumbers_() {
  const ranges = guestSheet_().getActiveRangeList();
  if (!ranges) return [];

  const rows = [];
  ranges.getRanges().forEach(function (range) {
    for (let r = range.getRow(); r < range.getRow() + range.getNumRows(); r += 1) {
      if (r >= FIRST_ROW && rows.indexOf(r) === -1) rows.push(r);
    }
  });
  return rows;
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function toast_(message) {
  SpreadsheetApp.getActiveSpreadsheet().toast(message, '💌 Wedding', 6);
}
