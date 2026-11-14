import { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import TimeSlots from './components/TimeSlots';
import BottomBar from './components/BottomBar';
import { fetchToday, fetchSlots } from './api';
import './App.css';

function App() {
  const [today, setToday] = useState(null);
  const [loadingToday, setLoadingToday] = useState(true);
  const [errorToday, setErrorToday] = useState(null);

  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [errorSlots, setErrorSlots] = useState(null);

  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // 1. Загрузка "сегодня" при открытии
  useEffect(() => {
    async function loadToday() {
      try {
        setLoadingToday(true);
        const data = await fetchToday();
        setToday(data);
        setCurrentMonth(data.month);
        setCurrentYear(data.year);
        setSelectedDay(data.day);
      } catch (err) {
        setErrorToday(err.message);
      } finally {
        setLoadingToday(false);
      }
    }
    loadToday();
  }, []);

  // 2. Загрузка слотов при смене дня
  useEffect(() => {
    if (!selectedDay || !today) return;
    
    let isActual = true; // Защита от гонок

    async function loadSlots() {
      try {
        setLoadingSlots(true);
        setErrorSlots(null);
        const data = await fetchSlots({ 
          day: selectedDay, 
          month: currentMonth, 
          year: currentYear 
        });
        
        if (isActual) {
          setSlots(data.slots);
        }
      } catch (err) {
        if (isActual) {
          setErrorSlots(err.message);
          setSlots([]);
        }
      } finally {
        if (isActual) {
          setLoadingSlots(false);
        }
      }
    }

    loadSlots();
    return () => { isActual = false; };
  }, [selectedDay, currentMonth, currentYear, today]);

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

  // Если идет загрузка "сегодня" или данных еще нет — показываем заглушку
  if (loadingToday || !today) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px', fontFamily: 'sans-serif' }}>
        Загрузка...
      </div>
    );
  }

  // Если ошибка — показываем текст
  if (errorToday) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px', color: 'red', fontFamily: 'sans-serif' }}>
        Ошибка: {errorToday}
      </div>
    );
  }

  const todayDate = new Date(today.year, today.month, today.day);

  return (
    <div className="app-wrapper">
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
              today={todayDate}
              onDayClick={handleDayClick}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />
            
            {loadingSlots ? (
              <section className="times">
                <h2 className="times__title">Доступное время</h2>
                <div className="times__grid"><p>Загрузка слотов...</p></div>
              </section>
            ) : errorSlots ? (
              <section className="times">
                <h2 className="times__title">Доступное время</h2>
                <div className="times__grid"><p style={{ color: 'red' }}>Ошибка: {errorSlots}</p></div>
              </section>
            ) : selectedDay ? (
              <TimeSlots 
                slots={slots.map(s => s.time)} 
                busySlots={slots.filter(s => !s.available).map(s => s.time)} 
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
    </div>
  );
}

export default App;