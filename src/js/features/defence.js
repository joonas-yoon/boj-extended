function extendRandomDefence() {
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
            <input type="checkbox" id="easy" value="Easy">
            <label for="easy">Easy</label>
            <input type="checkbox" id="medium" value="Medium">
            <label for="medium">Medium</label>
            <input type="checkbox" id="hard" value="Hard">
            <label for="hard">Hard</label>
          </div>
        </div>
        <div class="checkbox-row">
          <label for="algorithm">Algorithm:</label>
          <div class="checkbox-group">
            <input type="checkbox" id="sorting" value="Sorting">
            <label for="sorting">Sorting</label>
            <input type="checkbox" id="searching" value="Searching">
            <label for="searching">Searching</label>
            <input type="checkbox" id="dynamic" value="Dynamic Programming">
            <label for="dynamic">Dynamic Programming</label>
          </div>
        </div>
        <div class="dropdown-row">
          <label for="problem-count">Problem Count:</label>
          <select id="problem-count">
            ${Array.from(
              { length: 10 },
              (_, i) => `<option value="${i + 1}">${i + 1}</option>`
            ).join('')}
          </select>
        </div>
        <button id="generate-btn">Generate</button>
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
      height: 80%;
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
}
