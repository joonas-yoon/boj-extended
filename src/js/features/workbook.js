function getRowCount() {
    var targetTable = document.querySelector('.table.table-striped.table-bordered'); // 다른 표의 선택자를 지정
    var rowCount = targetTable.rows.length;
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

function extendWorkbookPage() {
    
    // Utils.loadCSS('css/scoreboard.css');
    // 표 생성 함수
    function createTable() {

        var columnCount = getRowCount();
        // 표 요소 생성
        var table = document.createElement('table');
        table.className = 'scoreboard-table'
    
        //행 생성
        var row = document.createElement('tr');

        //열 생성
        for (var i = 1; i < columnCount; i++) {      
            var cell = document.createElement('td');
            var num = problemNum(i-1);
            cell.textContent = num + '번';

            if(checkAC(i-1))
                cell.style.backgroundColor="green";

            if(checkWA(i-1))
                cell.style.backgroundColor="red";

            row.appendChild(cell);
        }
    
        // 표에 행 추가
        table.appendChild(row);
    
        // 원하는 위치에 표 추가
        var targetElement = document.querySelector('.page-header'); // 원하는 위치의 선택자를 지정
        targetElement.appendChild(table);        
    }
    
    // 표 생성 함수 호출
    createTable();
}

