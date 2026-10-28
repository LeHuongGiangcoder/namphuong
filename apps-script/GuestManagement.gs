/**
 * Quản lý khách mời — Kỳ Nam & Minh Phương
 *
 * Script RIÊNG của dự án này, gắn thẳng vào Google Sheet của cặp đôi
 * (Extensions → Apps Script), deploy thành Web app. Không dùng Glow RSVP Hub.
 * Hướng dẫn đầy đủ: docs/guest-management-google-sheets.md
 *
 * Sheet "Guests Management":
 *   No · Name · Invitation type · Table · Slug · Link
 *   Attending · Number · Other name · Note · Updated
 *
 * Cặp đôi điền Name, Invitation type và Table (số bàn, để trống nếu chưa xếp).
 * Slug + Link tự hiện khi điền xong Name + Invitation type. Khách mở link, trả
 * lời form, và script ghi ngược câu trả lời vào ĐÚNG dòng của khách đó.
 *
 * Cột được tìm theo TÊN TIÊU ĐỀ chứ không theo vị trí, nên chèn thêm cột hay
 * đổi thứ tự cột đều không sao — chỉ đừng đổi chữ ở hàng tiêu đề.
 */

const SITE_URL = 'https://namphuong.gloweb.site';

const SHEET_NAME = 'Guests Management';

const FIRST_ROW = 2; // hàng 1 là tiêu đề

// Tiêu đề (đã slugify) của từng cột. Table nhận cả "Số bàn" / "Bàn".
const HEADERS = {
  no: ['no'],
  name: ['name'],
  type: ['invitation-type'],
  table: ['table', 'so-ban', 'ban'],
  slug: ['slug'],
  link: ['link'],
  attending: ['attending'],
  number: ['number'],
  otherName: ['other-name'],
  note: ['note'],
  updated: ['updated'],
};

// Cột bắt buộc phải có; thiếu thì báo lỗi thay vì ghi nhầm chỗ
const REQUIRED = ['no', 'name', 'type', 'slug', 'link', 'attending', 'number', 'otherName', 'note'];

/* ────────────────────────────────────────────────────────────────────────────
   Menu + tự sinh link trong Sheet
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

/** Điền xong Name + Invitation type là Slug + Link tự hiện, khỏi bấm menu */
function onEdit(e) {
  if (!e || !e.range) return;
  const sheet = e.range.getSheet();
  if (sheet.getName() !== SHEET_NAME || e.range.getLastRow() < FIRST_ROW) return;

  const cols = columns_(sheet);
  const r = e.range;
  // Chỉ phản ứng khi sửa Name hoặc Invitation type
  const touches = [cols.name, cols.type].some(function (c) {
    return c >= r.getColumn() && c <= r.getLastColumn();
  });
  if (touches) fillRows_(function (row) { return !row.slug; });
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

/** Xoá câu trả lời để mời lại từ đầu */
function clearSelectedResponses() {
  const sheet = guestSheet_();
  const cols = columns_(sheet);
  const rows = selectedRowNumbers_();
  rows.forEach(function (rowNumber) {
    ['attending', 'number', 'otherName', 'note', 'updated'].forEach(function (key) {
      if (cols[key]) sheet.getRange(rowNumber, cols[key]).clearContent();
    });
  });
  toast_('Đã xoá câu trả lời của ' + rows.length + ' dòng.');
}

/* ────────────────────────────────────────────────────────────────────────────
   Web app: trang cưới gọi vào đây
   ──────────────────────────────────────────────────────────────────────── */

/**
 * GET ?slug=abc → { ok: true, name: 'Nguyễn Văn A', type: 'intimate', table: '5' }
 * Trang cưới dùng để hiện "Dear <tên khách>", quyết định có cho xem lễ vow
 * hay không, và hiện số bàn sau khi khách gửi form (rỗng = chưa xếp).
 */
function doGet(e) {
  const slug = e && e.parameter ? String(e.parameter.slug || '').trim() : '';
  if (!slug) return json_({ ok: true, service: 'namphuong-guests' });

  try {
    const found = findBySlug_(slug);
    if (!found) return json_({ ok: false, error: 'not found' });

    return json_({
      ok: true,
      name: found.name,
      type: normalizeType_(found.type),
      table: found.table,
    });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}

/**
 * POST { slug, name, attending, companions, companionNames, note }
 * Có slug → ghi đè câu trả lời của đúng dòng đó.
 * Không có slug (khách vào thẳng trang chủ) → thêm một dòng mới ở cuối.
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = guestSheet_();
    const cols = columns_(sheet);

    const yes = data.attending === 'yes';
    const answers = {
      attending: yes ? 'Có' : 'Không',
      number: yes ? Number(data.companions || 0) : 0,
      otherName: data.companionNames || '',
      note: data.note || '',
      updated: Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy HH:mm:ss'),
    };

    const slug = String(data.slug || '').trim();
    const found = slug ? findBySlug_(slug) : null;
    let rowNumber;

    if (found) {
      rowNumber = found.rowNumber;
    } else {
      // Khách lạ: vẫn ghi lại để không mất câu trả lời nào
      rowNumber = Math.max(sheet.getLastRow() + 1, FIRST_ROW);
      sheet.getRange(rowNumber, cols.no).setValue(rowNumber - FIRST_ROW + 1);
      sheet.getRange(rowNumber, cols.name).setValue(data.name || '(không rõ tên)');
      sheet.getRange(rowNumber, cols.type).setValue('general');
    }

    Object.keys(answers).forEach(function (key) {
      if (cols[key]) sheet.getRange(rowNumber, cols[key]).setValue(answers[key]);
    });

    return json_({ ok: true, status: 'success' });
  } catch (err) {
    return json_({ ok: false, status: 'error', error: String(err && err.message || err) });
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

/** Số cột (đếm từ 1) của từng trường, tìm theo tiêu đề hàng 1; không có thì 0 */
function columns_(sheet) {
  const lastCol = Math.max(sheet.getLastColumn(), 1);
  const titles = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(slugify_);

  const cols = {};
  Object.keys(HEADERS).forEach(function (key) {
    cols[key] = 0;
    HEADERS[key].some(function (h) {
      const i = titles.indexOf(h);
      if (i !== -1) cols[key] = i + 1;
      return i !== -1;
    });
  });

  const missing = REQUIRED.filter(function (key) { return !cols[key]; });
  if (missing.length) throw new Error('Thiếu cột tiêu đề: ' + missing.join(', '));
  return cols;
}

/** Đọc toàn bộ vùng khách một lần — nhanh hơn nhiều so với đọc từng ô */
function readGuests_(sheet, cols) {
  const lastRow = sheet.getLastRow();
  if (lastRow < FIRST_ROW) return [];

  const values = sheet.getRange(FIRST_ROW, 1, lastRow - FIRST_ROW + 1, sheet.getLastColumn()).getValues();
  return values.map(function (row, i) {
    return {
      rowNumber: FIRST_ROW + i,
      name: String(row[cols.name - 1] || '').trim(),
      type: String(row[cols.type - 1] || '').trim(),
      table: cols.table ? String(row[cols.table - 1]).trim() : '',
      slug: String(row[cols.slug - 1] || '').trim(),
    };
  });
}

function findBySlug_(slug) {
  const sheet = guestSheet_();
  const wanted = slug.toLowerCase();
  const guests = readGuests_(sheet, columns_(sheet));
  for (let i = 0; i < guests.length; i += 1) {
    if (guests[i].slug.toLowerCase() === wanted) return guests[i];
  }
  return null;
}

/**
 * Điền No + Slug + Link cho những dòng thoả `shouldFill`.
 * Ghi mỗi cột một lần ở cuối thay vì setValue từng ô — Sheet nhiều trăm dòng
 * mà ghi lẻ thì Apps Script hết thời gian chạy. Chỉ ghi ba cột này để không đè
 * lên chữ cặp đôi đang gõ ở các cột khác.
 */
function fillRows_(shouldFill, force) {
  const sheet = guestSheet_();
  const cols = columns_(sheet);
  const guests = readGuests_(sheet, cols);
  if (!guests.length) return { done: 0, skipped: 0 };

  const n = guests.length;
  const noCol = sheet.getRange(FIRST_ROW, cols.no, n, 1).getValues();
  const slugCol = sheet.getRange(FIRST_ROW, cols.slug, n, 1).getValues();
  const linkCol = sheet.getRange(FIRST_ROW, cols.link, n, 1).getValues();

  // Slug đã dùng, để hai khách trùng tên không đè lên nhau
  const taken = {};
  guests.forEach(function (g) {
    if (g.slug && !(force && shouldFill(g))) taken[g.slug.toLowerCase()] = true;
  });

  let no = 0;
  let done = 0;
  let skipped = 0;

  guests.forEach(function (g, i) {
    if (!g.name) return; // dòng trống, bỏ qua im lặng

    no += 1;
    noCol[i][0] = no;

    if (!g.type || !shouldFill(g)) {
      skipped += 1;
      return;
    }

    const slug = uniqueSlug_(g.name, taken);
    taken[slug] = true;

    slugCol[i][0] = slug;
    linkCol[i][0] = SITE_URL + '/?to=' + slug;
    done += 1;
  });

  sheet.getRange(FIRST_ROW, cols.no, n, 1).setValues(noCol);
  sheet.getRange(FIRST_ROW, cols.slug, n, 1).setValues(slugCol);
  sheet.getRange(FIRST_ROW, cols.link, n, 1).setValues(linkCol);
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
    .replace(/[̀-ͯ]/g, '')
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
