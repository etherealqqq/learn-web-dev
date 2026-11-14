const TIME_SLOTS = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

const MONTHS_NOMINATIVE = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const MONTHS_GENITIVE = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
const DAYS_OF_WEEK = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

const TODAY = new Date(); 

const state = {
  currentMonth: TODAY.getMonth(),
  currentYear: TODAY.getFullYear(),
  selectedDay: TODAY.getDate(),
  selectedTime: null,
};

function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const cells = [];

  for (let i = offset - 1; i >= 0; i--) {
    cells.push({ day: prevMonthLastDay - i, otherMonth: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, otherMonth: false });
  }
  const totalCells = Math.ceil(cells.length / 7) * 7;
  let nextDay = 1;
  while (cells.length < totalCells) {
    cells.push({ day: nextDay, otherMonth: true });
    nextDay++;
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

function compareDates(d1, d2) {
  const date1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const date2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return date1.getTime() - date2.getTime();
}

function isDateSelectable(day, month, year) {
  const date = new Date(year, month, day);
  return compareDates(date, TODAY) >= 0;
}

function getBusySlots(day, month, year) {
  const seed = day + month * 31 + year * 365; 
  const busy = [];
  
  TIME_SLOTS.forEach((time, index) => {
    const hash = (seed + index * 7) % 10; 
    if (hash < 3) {
      busy.push(time);
    }
  });
  
  if (busy.length === TIME_SLOTS.length) {
    busy.pop();
  }
  
  return busy;
}

function renderCalendar() {
  const monthEl = document.getElementById('current-month');
  monthEl.textContent = `${MONTHS_NOMINATIVE[state.currentMonth]} ${state.currentYear}`;

  const daysContainer = document.getElementById('calendar-days');
  const weeks = buildCalendarGrid(state.currentYear, state.currentMonth);
  
  let html = '';
  weeks.forEach(week => {
    week.forEach(cell => {
      let classes = ['day'];
      
      if (cell.otherMonth) {
        classes.push('day--other');
        html += `<span class="${classes.join(' ')}">${cell.day}</span>`;
      } else {
        if (!isDateSelectable(cell.day, state.currentMonth, state.currentYear)) {
          classes.push('day--disabled');
        } 
        
        if (cell.day === state.selectedDay) {
          classes.push('day--selected');
        }

        html += `<span class="${classes.join(' ')}" data-day="${cell.day}">${cell.day}</span>`;
      }
    });
  });

  daysContainer.innerHTML = html;

  const dayElements = daysContainer.querySelectorAll('.day:not(.day--other):not(.day--disabled)');
  dayElements.forEach(el => el.addEventListener('click', onDayClick));
}

function renderTimeSlots() {
  const slotsContainer = document.getElementById('time-slots');
  
  if (state.selectedDay === null) {
    slotsContainer.innerHTML = '<p>Выберите день</p>';
    return;
  }

  const busySlotsForDay = getBusySlots(state.selectedDay, state.currentMonth, state.currentYear);
  
  let html = '';
  TIME_SLOTS.forEach(time => {
    const isBusy = busySlotsForDay.includes(time);
    const isSelected = time === state.selectedTime;
    
    let classes = ['slot'];
    if (isBusy) classes.push('slot--busy');
    if (isSelected) classes.push('slot--selected');
    
    const disabledAttr = isBusy ? 'disabled' : '';
    const label = isBusy ? '<span class="slot__label">Занято</span>' : '';

    html += `
      <button class="${classes.join(' ')}" data-time="${time}" ${disabledAttr}>
        ${time} ${label}
      </button>
    `;
  });
  
  slotsContainer.innerHTML = html;

  const slotElements = slotsContainer.querySelectorAll('.slot:not(.slot--busy)');
  slotElements.forEach(el => el.addEventListener('click', onTimeSlotClick));
}

function updateBottomBar() {
  const infoEl = document.getElementById('selected-info');
  
  if (state.selectedDay && state.selectedTime) {
    const date = new Date(state.currentYear, state.currentMonth, state.selectedDay);
    let dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
    const dayName = DAYS_OF_WEEK[dayIndex];
    const monthName = MONTHS_GENITIVE[state.currentMonth];
    
    infoEl.innerHTML = `Вы записались на:<br><span class="actions__date">${dayName}, ${state.selectedDay} ${monthName} ${state.currentYear} • ${state.selectedTime}</span>`;
  } else if (state.selectedDay) {
    infoEl.textContent = 'Выберите время';
  } else {
    infoEl.textContent = 'Выберите дату и время';
  }
}


function onDayClick(event) {
  const el = event.currentTarget;
  state.selectedDay = parseInt(el.dataset.day);
  state.selectedTime = null; // Сброс времени при смене дня

  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

function onTimeSlotClick(event) {
  const el = event.currentTarget;
  state.selectedTime = el.dataset.time;
  
  renderTimeSlots();
  updateBottomBar();
}

function setupMonthNavigation() {
  document.getElementById('prev-month').addEventListener('click', () => {
    state.currentMonth--;
    if (state.currentMonth < 0) {
      state.currentMonth = 11;
      state.currentYear--;
    }
    state.selectedDay = null; 
    state.selectedTime = null;
    
    renderCalendar();
    renderTimeSlots();
    updateBottomBar();
  });

  document.getElementById('next-month').addEventListener('click', () => {
    state.currentMonth++;
    if (state.currentMonth > 11) {
      state.currentMonth = 0;
      state.currentYear++;
    }
    state.selectedDay = null;
    state.selectedTime = null;
    
    renderCalendar();
    renderTimeSlots();
    updateBottomBar();
  });
}

function init() {
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
  setupMonthNavigation();
}

document.addEventListener('DOMContentLoaded', init);