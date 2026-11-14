import { useState } from 'react';
import Calendar from './components/Calendar';
import TimeSlots from './components/TimeSlots';
import BottomBar from './components/BottomBar';
import { getBusySlots } from './date';
import './App.css'; 

const TIME_SLOTS = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

function App() {
  const today = new Date(); 

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedTime, setSelectedTime] = useState(null);

  const busySlots = selectedDay 
    ? getBusySlots(selectedDay, currentMonth, currentYear, TIME_SLOTS) 
    : [];

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setSelectedTime(null); 
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
    setSelectedTime(null);
  };

  return (
    <>
      <header className="header">
        <div className="container header__container">
          <a href="#" className="logo">
            <img src="images/logo.jpg" alt="Hair Salon" className="logo__img" />
          </a>
          <nav className="nav">
            <a href="#" className="nav__link">Услуги</a>
            <a href="#" className="nav__link">Мастера</a>
            <a href="#" className="nav__link">Отзывы</a>
            <a href="#" className="nav__link">Контакты</a>
            <a href="#" className="nav__link">О салоне</a>
          </nav>
        </div>
      </header>

      <div className="steps">
        <div className="container steps__container">
          <div className="step"><span className="step__num">1</span><span className="step__name">Мастер</span></div>
          <div className="step__line"></div>
          <div className="step"><span className="step__num">2</span><span className="step__name">Услуга</span></div>
          <div className="step__line"></div>
          <div className="step step--active"><span className="step__num">3</span><span className="step__name">Календарь</span></div>
          <div className="step__line"></div>
          <div className="step"><span className="step__num">4</span><span className="step__name">Контакты</span></div>
          <div className="step__line"></div>
          <div className="step"><span className="step__num">5</span><span className="step__name">Подтверждение</span></div>
        </div>
      </div>

      <main className="main">
        <div className="container">
          <h1 className="main__title">Выберите дату и время</h1>

          <div className="picker">
            <Calendar 
              currentYear={currentYear}
              currentMonth={currentMonth}
              selectedDay={selectedDay}
              today={today}
              onDayClick={handleDayClick}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />
            
            {selectedDay ? (
              <TimeSlots 
                slots={TIME_SLOTS}
                busySlots={busySlots}
                selectedTime={selectedTime}
                onTimeClick={setSelectedTime}
              />
            ) : (
              <section className="times">
                <h2 className="times__title">Доступное время</h2>
                <div className="times__grid"><p>Выберите день</p></div>
              </section>
            )}
          </div>

          <BottomBar 
            selectedDay={selectedDay}
            selectedTime={selectedTime}
            currentMonth={currentMonth}
            currentYear={currentYear}
          />
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer__top">
            <div className="footer__brand">
              <img src="images/logo.jpg" alt="Hair Salon" className="footer__logo" />
              <p className="footer__desc">Стрижки, окрашивание, уход. Мастера своего дела, честные цены, отличное настроение. Ждём вас!</p>
            </div>
            <div className="footer__contacts">
              <h3 className="footer__title">Контакты</h3>
              <p>📍 ул. Садовая, 15, Москва</p>
              <p>📞 +7 (495) 123-45-67</p>
            </div>
            <div className="footer__hours">
              <h3 className="footer__title">Режим работы</h3>
              <p>Пн–Пт: 9:00 – 21:00</p>
              <p>Сб–Вс: 10:00 – 19:00</p>
            </div>
          </div>
          <div className="footer__bottom">
            <p>© 2026. Все права защищены.</p>
            <a href="#" className="footer__link">Политика конфиденциальности</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;