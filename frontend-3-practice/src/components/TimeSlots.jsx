export default function TimeSlots({ slots, busySlots, selectedTime, onTimeClick }) {
  return (
    <section className="times">
      <h2 className="times__title">Доступное время</h2>
      <div className="times__grid">
        {slots.map((time) => {
          const isBusy = busySlots.includes(time);
          const isSelected = time === selectedTime;
          
          let classes = ['slot'];
          if (isBusy) classes.push('slot--busy');
          if (isSelected) classes.push('slot--selected');

          return (
            <button 
              key={time} 
              className={classes.join(' ')} 
              disabled={isBusy}
              onClick={() => onTimeClick(time)}
            >
              {time} {isBusy && <span className="slot__label">Занято</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}