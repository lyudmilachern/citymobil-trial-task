let tariffsData = [];
let carsData = [];
const selectedCarElement = document.getElementById('selectedCar');

function renderHeader(tariffs) {
  const header = document.querySelector('#searchTable thead');
  const headerRow = header.querySelector('tr');
  let result = '<th class="brandModel">Марка и модель</th>';
  tariffs.forEach(tariff => {
    result += `<th>${tariff}</th>`;
  });
  headerRow.innerHTML = result;
  header.querySelector('.brandModel').addEventListener('click', getSort);
}

function renderRows(cars) {
	if (!Array.isArray(cars)) return;
	let resultHTML = '';
  cars.forEach(car => {
  	resultHTML += generateRow(car);
  });
	const container = document.getElementById('carsList');
  container.innerHTML = resultHTML;
}

function generateRow(car) {
  return `
    <tr onclick="selectCar('${encodeURIComponent(JSON.stringify(car))}')">
      <td class="brandModel">${car.mark} ${car.model}</td>
      ${generateCarTariffs(car)}
    </tr>
  `;
}

function generateCarTariffs(car) {
  let result = '';
  tariffsData.forEach(tariff => {
    const carTariff = car.tariffs[tariff];
    result += `<td>${carTariff ? carTariff.year : '-'}</td>`;
  });
  return result;
}

function selectCar(car) {
  car = JSON.parse(decodeURIComponent(car));
  const targetEl = selectedCarElement.querySelector('div');
  let tariffsText = '';
  for (const [tariff, data] of Object.entries(car.tariffs)) {
    tariffsText += ` ${tariff} - ${data.year}`;
  }
  targetEl.innerText = `Выбран автомобиль ${car.mark} ${car.model}. Доступны тарифы:${tariffsText}`;
  selectedCarElement.style.display = 'flex';
}

function deselectCar() {
  selectedCarElement.style.display = 'none';
}

function getSort ({ target }) {
    const order = (target.dataset.order = -(target.dataset.order || -1));
    const index = [...target.parentNode.cells].indexOf(target);
    const collator = new Intl.Collator(['en', 'ru'], { numeric: true });
    const comparator = (index, order) => (a, b) => order * collator.compare(
        a.children[index].innerHTML,
        b.children[index].innerHTML
    );
    
    for(const tBody of target.closest('table').tBodies)
        tBody.append(...[...tBody.rows].sort(comparator(index, order)));

    for(const cell of target.parentNode.cells)
        cell.classList.toggle('sorted', cell === target);
};

function search() {
  let input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("searchTable");
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

async function fetchCarsData() {
  showLoadingIndicator();
  try {
    const response = await fetch('https://city-mobil.ru/api/cars');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    data = await response.json();
    tariffsData = data.tariffs_list;
    carsData = data.cars;
    renderHeader(tariffsData);
    renderRows(carsData);
  } catch (e) {
    console.log(e);
  }
  removeLoadingIndicator();
}

function showLoadingIndicator() {
  const loadingIndicator = document.createElement('div');
  loadingIndicator.id = 'loadingIndicator';
  loadingIndicator.innerHTML = 'Загрузка...';
  document.body.appendChild(loadingIndicator);
}

function removeLoadingIndicator() {
  const loadingIndicator = document.getElementById('loadingIndicator');
  loadingIndicator && loadingIndicator.remove();
}

function onStart() {
  fetchCarsData();
}
document.addEventListener('DOMContentLoaded', onStart);