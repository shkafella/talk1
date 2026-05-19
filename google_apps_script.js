// ШкафеLLA — Google Apps Script
// Вставь этот код в https://script.google.com → Новый проект
// Затем: Развернуть → Новое развертывание → Веб-приложение
// Доступ: "Все" → скопируй URL и вставь в index.html

const SPREADSHEET_ID = '1ovh6v9mNXUTBtJlyNbf3e6a1XoP_9jd4Qxe48KFlZCg';
const SHEET_NAME = 'Лист6';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: 'Лист не найден' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const now = new Date();
    const dateStr = Utilities.formatDate(now, 'Europe/Moscow', 'dd.MM.yyyy HH:mm:ss');
    
    // Собираем ссылки: Firebase Storage URLs + внешняя ссылка
    const fileLinks = (data.files || []).map(f => f.url).join('\n');
    const allLinks = [fileLinks, data.externalLink].filter(Boolean).join('\n');
    
    // Формат = существующая таблица Лист6:
    // Пользователь | Дата | Фамилия/компания | Адрес/№ | Вид работ | Ссылка | Комментарий | Дата готовности
    const row = [
      'shkafella_app',   // Пользователь (можно потом добавить имя)
      dateStr,           // Дата
      data.client,       // Фамилия/компания
      data.address,      // Адрес/№ заказа
      data.workType,     // Вид работ
      allLinks || '-',   // Ссылки на файлы
      data.comment || '-',
      data.date || '-',
    ];
    
    sheet.appendRow(row);
    
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, ref: data.ref }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: 'ШкафеLLA API работает ✓' }))
    .setMimeType(ContentService.MimeType.JSON);
}
