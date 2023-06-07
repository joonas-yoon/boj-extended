function extendRandomDefence() {
  function addElementToBar(element) {
    const topbar = document.querySelector('.topbar ul');
    topbar.appendChild(element);
  }

  // Add devide bar to topbar
  const dividerLi = document.createElement('li');
  dividerLi.classList.add('topbar-devider');
  addElementToBar(dividerLi);

  // UI: add button to topbar
  const btnLi = document.createElement('li');
  const btnBar = document.createElement('a');
  btnBar.innerHTML = '<i class="fa fa-shield"></i>';
  btnLi.appendChild(btnBar);
  btnBar.addEventListener('click', (evt) => {
    evt.preventDefault();
    openModal(); // Open the modal
  });
  addElementToBar(btnLi);

  // Add modal HTML
  const modalHTML = `
    <div id="defence-modal" class="modal">
      <div class="modal-content">
        <span class="close">&times;</span>
        <div class="modal-content-inner">
          <h3 class="modal-title">Random Defence</h3>
          <div class="checkbox-row">
            <label for="difficulty">Difficulty:</label>
            <div class="checkbox-group">
              <input type="checkbox" id="bronze" value="Bronze">
              <label for="bronze">Bronze</label>
              <input type="checkbox" id="silver" value="Silver">
              <label for="silver">Silver</label>
              <input type="checkbox" id="gold" value="Gold">
              <label for="gold">Gold</label>
              <input type="checkbox" id="platinum" value="Platinum">
              <label for="platinum">Platinum</label>
              <input type="checkbox" id="diamond" value="Diamond">
              <label for="diamond">Diamond</label>
              <input type="checkbox" id="ruby" value="Ruby">
              <label for="ruby">Ruby</label>
            </div>
          </div>
          <div class="checkbox-row">
            <label for="algorithm">Algorithm:</label>
            <div class="dropdown-row" id="algorithm-dropdown"></div>
          </div>
          <div class="checkbox-row">
            <label for="problem-count">Problem Count:</label>
            <select class="dropdown-row" id="problem-count">
              ${Array.from(
                { length: 10 },
                (_, i) => `<option value="${i + 1}">${i + 1}</option>`
              ).join('')}
            </select>
          </div>
          <button class="generate-btn" id="generate-btn">Generate</button>
          <div id="result"></div>
        </div>
      </div>
    </div>
  `;

  // Add modal CSS
  const modalCSS = `
    <style>
      /* Modal styles */
      .modal {
        display: none;
        position: fixed;
        z-index: 9999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0, 0, 0, 0.4);
      }

      .modal-content {
        background-color: #fefefe;
        margin: 10% auto;
        padding: 20px;
        border: 1px solid #888;
        width: 80%;
        max-width: 600px;
        height: 80%;
        max-height: 600px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      .close {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
      }

      .close:hover,
      .close:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
      }

      /* Additional styles */
      .modal-content-inner {
        margin-top: 20px;
        text-align: center;
      }

      .modal-title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .checkbox-row {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }

      .dropdown-row {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        color: black
      }

      label {
        font-weight: bold;
        display: block;
        margin-right: 10px;
      }

      .checkbox-group {
        display: flex;
        gap: 10px;
      }
      .generate-btn{
        color: black;
      }
      input[type="checkbox"] {
        display: inline-block;
      }

      select {
        width: 60px;
      }

      button {
        padding: 5px 10px;
      }

      #result {
        margin-top: 20px;
        font-weight: bold;
      }

      /* Topbar styles */
      .topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 20px;
        background-color: #333;
        color: #fff;
      }

      .topbar .topbar-divider {
        height: 24px;
        width: 1px;
        background-color: #fff;
        margin: 0 10px;
      }

      .topbar .btn-bar {
        font-size: 20px;
        cursor: pointer;
      }
    </style>
  `;

  // Add modal HTML and CSS to the page
  document.head.insertAdjacentHTML('beforeend', modalCSS);
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Open modal function
  function openModal() {
    const modal = document.getElementById('defence-modal');
    modal.style.display = 'block';
  }

  // Close modal function
  function closeModal() {
    const modal = document.getElementById('defence-modal');
    modal.style.display = 'none';
  }

  // Add event listener to close button
  document.addEventListener('click', (event) => {
    if (event.target && event.target.classList.contains('close')) {
      closeModal();
    }
  });

  // Fetch algorithm categories from the website
  fetch('https://www.acmicpc.net/problem/tags')
    .then((response) => response.text())
    .then((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const table = doc.querySelector('.table-responsive table');
      const rows = Array.from(table.querySelectorAll('tbody tr'));

      const dropdownMenu = document.createElement('select'); // 드롭다운 메뉴 요소 생성

      rows.forEach((row) => {
        const categoryName = row
          .querySelector('td:nth-child(1)')
          .textContent.trim()
          .toLowerCase();

        const categoryLinks = Array.from(
          row.querySelectorAll('td:nth-child(2) a')
        );

        if (categoryLinks.length > 0) {
          const optgroup = document.createElement('optgroup'); // 옵트그룹 요소 생성
          optgroup.label = categoryName; // 옵트그룹 레이블 설정

          categoryLinks.forEach((link) => {
            const categoryId = link.getAttribute('href').split('/').pop();
            const categoryName = link.textContent.trim();

            const option = document.createElement('option'); // 옵션 요소 생성
            option.value = categoryId;
            option.textContent = categoryName;

            optgroup.appendChild(option); // 옵션을 옵트그룹에 추가
          });

          dropdownMenu.appendChild(optgroup); // 옵트그룹을 드롭다운 메뉴에 추가
        }
      });

      const dropdownContainer = document.getElementById('algorithm-dropdown'); // 드롭다운 메뉴를 추가할 컨테이너 요소
      dropdownContainer.appendChild(dropdownMenu); // 드롭다운 메뉴를 컨테이너에 추가
    });

  // Generate button click event
  document.getElementById('generate-btn').addEventListener('click', () => {
    const selectedDifficulties = Array.from(
      document.querySelectorAll('[type="checkbox"]:checked')
    )
      .filter(
        (checkbox) => checkbox.id !== 'bronze' && checkbox.id !== 'silver'
      ) // Exclude bronze and silver difficulties
      .map((checkbox) => checkbox.value);
    const selectedAlgorithms = Array.from(
      document.querySelectorAll(
        '#algorithm-checkboxes [type="checkbox"]:checked'
      )
    ).map((checkbox) => checkbox.value);
    const problemCount = document.getElementById('problem-count').value;

    if (
      selectedDifficulties.length === 0 ||
      selectedAlgorithms.length === 0 ||
      problemCount === ''
    ) {
      document.getElementById('result').textContent =
        'Please select difficulties, algorithms, and problem count.';
      return;
    }

    document.getElementById(
      'result'
    ).textContent = `Selected difficulties: ${selectedDifficulties.join(
      ', '
    )}, Selected algorithms: ${selectedAlgorithms.join(
      ', '
    )}, Problem count: ${problemCount}`;
  });
}
