import { DAYS_OF_WEEK, MONTHS_GENITIVE } from '../date';

export default function BottomBar({ selectedDay, selectedTime, currentMonth, currentYear }) {
  let content = <p className="actions__text">Выберите дату и время</p>;

  if (selectedDay && selectedTime) {
    const date = new Date(currentYear, currentMonth, selectedDay);
    let dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
    const dayName = DAYS_OF_WEEK[dayIndex];
    const monthName = MONTHS_GENITIVE[currentMonth];

    content = (
      <p className="actions__text">
        Вы записались на:<br/>
        <span className="actions__date">{dayName}, {selectedDay} {monthName} {currentYear} • {selectedTime}</span>
      </p>
    );
  } else if (selectedDay) {
    content = <p className="actions__text">Выберите время</p>;
  }

  return (
    <div className="actions">
      <button className="btn">Назад</button>
      {content}
      <button className="btn">Далее</button>
    </div>
  );
}