function getRowCount() {
    let targetTable = document.querySelector('.table.table-striped.table-bordered'); // 다른 표의 선택자를 지정
    let rowCount = targetTable.rows.length;
    return rowCount;
}

function problemNum(index) {
    const table = document.querySelector('.table.table-striped.table-bordered');
    const rows = table.querySelectorAll('tbody tr');
    const row = rows[index];
    
    const cell = row.querySelector('td:nth-child(1)');

    
    return cell.textContent;
}

function checkAC(index) {
    const table = document.querySelector('.table.table-striped.table-bordered');
    const rows = table.querySelectorAll('tbody tr');
    const row = rows[index];
    
    if (row) {
      const cell = row.querySelector('td:nth-child(3)');
      const acElement = cell.querySelector('.problem-label.problem-label-ac');
      return acElement !== null;
    }
    
    return false;
}
function checkWA(index) {
    const table = document.querySelector('.table.table-striped.table-bordered');
    const rows = table.querySelectorAll('tbody tr');
    const row = rows[index];
    
    if (row) {
      const cell = row.querySelector('td:nth-child(3)');
      const acElement = cell.querySelector('.problem-label.problem-label-wa');
      return acElement !== null;
    }
    
    return false;
}

function convertToHyperlink(cell) {
    const text = cell.textContent;
    const url = '/problem/' + text; // 원하는 URL을 입력하세요
  
    const link = document.createElement('a');
    link.href = url;
    link.textContent = text;
  
    cell.innerHTML = '';
    cell.appendChild(link);
}

function extendWorkbookPage() {
    
    // Utils.loadCSS('css/scoreboard.css');
    // 표 생성 함수
    function createTable() {

        let columnCount = getRowCount();
        // 표 요소 생성
        let table = document.createElement('table');
        table.className = 'scoreboard-table'
    
        //행 생성
        let row = document.createElement('tr');

        //열 생성
        for (let i = 1; i < columnCount; i++) {      
            let cell = document.createElement('td');
            let num = problemNum(i-1);
            cell.textContent = num;
            convertToHyperlink(cell);
            cell.style.borderCollapse = 'collapse';
            cell.style.border = '1px solid black';

            if(checkAC(i-1))
                cell.style.backgroundColor="green";

            if(checkWA(i-1))
                cell.style.backgroundColor= "red";

            row.appendChild(cell);
        }
    
        // 표에 행 추가
        table.appendChild(row);
        table.style.width = '100%';
        table.style.maxWidth = '100%';
        table.style.height = '50px';
        
        // 원하는 위치에 표 추가
        const targetElement = document.querySelector('.page-header'); // 원하는 위치의 선택자를 지정
        targetElement.appendChild(table);        
    }

    // 표 생성 함수 호출
        createTable();
}

