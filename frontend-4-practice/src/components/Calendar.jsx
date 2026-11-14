import { buildCalendarGrid, isDateSelectable, MONTHS_NOMINATIVE } from '../utils/date';

export default function Calendar({ currentYear, currentMonth, selectedDay, today, onDayClick, onPrevMonth, onNextMonth }) {
  const weeks = buildCalendarGrid(currentYear, currentMonth);

  return (
    <section className="calendar">
      <div className="calendar__header">
        <span className="calendar__month">{MONTHS_NOMINATIVE[currentMonth]} {currentYear}</span>
        <div className="calendar__controls">
          <button className="calendar__btn" onClick={onPrevMonth} aria-label="Предыдущий месяц">‹</button>
          <button className="calendar__btn" onClick={onNextMonth} aria-label="Следующий месяц">›</button>
        </div>
      </div>
      
      <div className="calendar__weekdays">
        <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span>
      </div>

      <div className="calendar__days">
        {weeks.map((week, wIndex) => (
          week.map((cell, dIndex) => {
            let classes = ['day'];
            if (cell.otherMonth) {
              classes.push('day--other');
            } else {
              if (!isDateSelectable(cell.day, currentMonth, currentYear, today)) {
                classes.push('day--disabled');
              }
              if (cell.day === selectedDay) {
                classes.push('day--selected');
              }
            }

            return (
              <span 
                key={`${wIndex}-${dIndex}`} 
                className={classes.join(' ')}
                onClick={() => !cell.otherMonth && isDateSelectable(cell.day, currentMonth, currentYear, today) && onDayClick(cell.day)}
              >
                {cell.day}
              </span>
            );
          })
        ))}
      </div>
    </section>
  );
}