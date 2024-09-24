import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

const formattedSeconds = (sec: number) =>
  Math.floor(sec / 60) + ':' + ('0' + (sec % 60)).slice(-2);

interface StopwatchProps {
  initialSeconds: number;
}

const Stopwatch: React.FC<StopwatchProps> = ({ initialSeconds }) => {
  const [secondsElapsed, setSecondsElapsed] = useState(initialSeconds);
  const [lastClearedIncrementer, setLastClearedIncrementer] =
    useState<ReturnType<typeof setInterval> | null>(null);
  const [laps, setLaps] = useState<number[]>([]);
  const incrementer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (incrementer.current) {
        clearInterval(incrementer.current);
      }
    };
  }, []);

  const handleStartClick = () => {
    incrementer.current = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
  };

  const handleStopClick = () => {
    if (incrementer.current) {
      clearInterval(incrementer.current);
      setLastClearedIncrementer(incrementer.current);
    }
  };

  const handleResetClick = () => {
    if (incrementer.current) {
      clearInterval(incrementer.current);
    }
    setLaps([]);
    setSecondsElapsed(0);
  };

  const handleLapClick = () => {
    setLaps((prevLaps) => [...prevLaps, secondsElapsed]);
  };

  const handleDeleteClick = (index: number) => () => {
    setLaps((prevLaps) => prevLaps.filter((_, i) => i !== index));
  };

  const showStartButton =
    secondsElapsed === 0 || incrementer.current === lastClearedIncrementer;
  const showLapButton =
    secondsElapsed !== 0 && incrementer.current !== lastClearedIncrementer;
  const showResetButton =
    secondsElapsed !== 0 && incrementer.current === lastClearedIncrementer;

  return (
    <div className="stopwatch">
      <h1 className="stopwatch-timer">{formattedSeconds(secondsElapsed)}</h1>
      {showStartButton ? (
        <button type="button" className="start-btn" onClick={handleStartClick}>
          start
        </button>
      ) : (
        <button type="button" className="stop-btn" onClick={handleStopClick}>
          stop
        </button>
      )}
      {showLapButton && (
        <button type="button" onClick={handleLapClick}>
          lap
        </button>
      )}
      {showResetButton && (
        <button type="button" onClick={handleResetClick}>
          reset
        </button>
      )}
      <div className="stopwatch-laps">
        {laps.map((lap, i) => {
          return (
            <Lap
              key={i}
              index={i + 1}
              lap={lap}
              onDelete={handleDeleteClick(i)}
            />
          );
        })}
      </div>
    </div>
  );
};

const Lap: React.FC<{ index: number; lap: number; onDelete: () => void }> = ({
  index,
  lap,
  onDelete,
}) => (
  <div className="stopwatch-lap">
    <strong>{index}</strong>/ {formattedSeconds(lap)}{' '}
    <button onClick={onDelete}>X</button>
  </div>
);

const root = ReactDOM.createRoot(
  document.getElementById('content') as HTMLElement,
);
root.render(<Stopwatch initialSeconds={0} />);
