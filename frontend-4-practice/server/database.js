// Получаем реальную сегодняшнюю дату
const now = new Date();

export const database = {
    today: { 
        day: now.getDate(), 
        month: now.getMonth(), 
        year: now.getFullYear() 
    },
  
    // Слоты для чётных дней (2, 4, 6, ...)
    slotsEvenDay: [
      { time: "10:00", available: true },
      { time: "11:00", available: false }, // Занято
      { time: "12:00", available: true },
      { time: "13:00", available: true },
      { time: "14:00", available: true },
      { time: "15:00", available: false }, // Занято
      { time: "16:00", available: true },
      { time: "17:00", available: true },
    ],
  
    // Слоты для нечётных дней (1, 3, 5, ...)
    slotsOddDay: [
      { time: "10:00", available: true },
      { time: "11:00", available: true },
      { time: "12:00", available: false }, // Занято
      { time: "13:00", available: true },
      { time: "14:00", available: true },
      { time: "15:00", available: true },
      { time: "16:00", available: false }, // Занято
      { time: "17:00", available: true },
    ],
  };