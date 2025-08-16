const SPREADSHEET_ID = "1vandm50t_Nf_zSHyPLqVmVkgoDdfzY2qQHUdQPTKGe0";
const CURRICULUM_SHEET_NAME = "커리큘률_데이터";
const REQUEST_SHEET_NAME = "수강신청_내역";

// 앱 실행시 초기 설정 (시트, 헤더 자동 생성)
function setup() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // 커리큘럼 데이터 시트 확인 및 생성
  let curriculumSheet = ss.getSheetByName(CURRICULUM_SHEET_NAME);
  if (!curriculumSheet) {
    curriculumSheet = ss.insertSheet(CURRICULUM_SHEET_NAME);
    const headers = [["id", "cat1", "cat2", "title", "details", "time", "tool"]];
    curriculumSheet.getRange(1, 1, 1, headers[0].length).setValues(headers);
  }

  // 수강신청 내역 시트 확인 및 생성
  let requestSheet = ss.getSheetByName(REQUEST_SHEET_NAME);
  if (!requestSheet) {
    requestSheet = ss.insertSheet(REQUEST_SHEET_NAME);
    const headers = [["timestamp", "company", "manager", "totalTime", "curriculumList"]];
    requestSheet.getRange(1, 1, 1, headers[0].length).setValues(headers);
  }
}


// 웹 앱 진입점
function doGet(e) {
  setup(); // 실행 시마다 기본 구조 확인
  if (e.parameter.page == 'admin') {
    return HtmlService.createHtmlOutputFromFile('admin').setTitle('관리자 페이지');
  } else {
    return HtmlService.createHtmlOutputFromFile('index').setTitle('커리큘럼 장바구니');
  }
}

// 비밀번호 확인
function checkPassword(password) {
  const storedPassword = PropertiesService.getScriptProperties().getProperty('ADMIN_PASSWORD') || '0813';
  return password === storedPassword;
}

// --- 데이터 CRUD 함수 ---

function getCurriculumData() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(CURRICULUM_SHEET_NAME);
  if (sheet.getLastRow() <= 1) { // 헤더만 있거나 비어있을 경우
    return [];
  }
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  // [[id, cat1, ...], [id, cat1, ...]]
  return data.map(row => ({
      id: row[0],
      cat1: row[1],
      cat2: row[2],
      title: row[3],
      details: row[4],
      time: row[5],
      tool: row[6]
  }));
}

function addCurriculum(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(CURRICULUM_SHEET_NAME);
  const newId = sheet.getLastRow() > 0 ? Math.max(...sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().flat()) + 1 : 1;
  sheet.appendRow([newId, data.cat1, data.cat2, data.title, data.details, data.time, data.tool]);
  return { success: true, newId: newId };
}

function updateCurriculum(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(CURRICULUM_SHEET_NAME);
  const range = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1);
  const rowValues = range.getValues();
  
  for (let i = 0; i < rowValues.length; i++) {
    if (rowValues[i][0] == data.id) {
      sheet.getRange(i + 2, 2, 1, 6).setValues([[data.cat1, data.cat2, data.title, data.details, data.time, data.tool]]);
      return { success: true };
    }
  }
  return { success: false, message: "ID not found" };
}

function deleteCurriculum(id) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(CURRICULUM_SHEET_NAME);
  const range = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1);
  const rowValues = range.getValues();

  for (let i = 0; i < rowValues.length; i++) {
    if (rowValues[i][0] == id) {
      sheet.deleteRow(i + 2);
      return { success: true };
    }
  }
  return { success: false, message: "ID not found" };
}

function saveCustomerRequest(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheetName = `${data.company}_교육커리큘럼`;
    let newSheet = ss.getSheetByName(sheetName);
    if (newSheet) {
      newSheet.clear(); // 동일한 이름의 시트가 있으면 내용을 지움
    } else {
      newSheet = ss.insertSheet(sheetName);
    }

    // 헤더 추가
    const headers = ["카테고리", "과목명", "상세 내용", "시간(분)", "활용 툴"];
    newSheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // 데이터 추가 (카테고리별 정렬)
    const sortedList = data.curriculumList.sort((a, b) => {
        if (a.cat1 < b.cat1) return -1;
        if (a.cat1 > b.cat1) return 1;
        if (a.cat2 < b.cat2) return -1;
        if (a.cat2 > b.cat2) return 1;
        return 0;
    });

    const rows = sortedList.map(item => [item.cat1, item.title, item.details, item.time, item.tool]);
    newSheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);

    // 메타 정보 추가
    newSheet.getRange(rows.length + 3, 1, 4, 2).setValues([
        ["담당자", data.manager],
        ["고객사", data.company],
        ["총 시간", data.totalTime],
        ["저장일시", new Date()]
    ]);

    // 수강신청 내역 시트에도 요약본 저장
    const requestSheet = ss.getSheetByName(REQUEST_SHEET_NAME);
    const curriculumTitles = data.curriculumList.map(item => item.title).join(", ");
    requestSheet.appendRow([new Date(), data.company, data.manager, data.totalTime, curriculumTitles]);

    return { success: true, sheetName: sheetName };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}