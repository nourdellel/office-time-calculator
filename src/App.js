import React, { useState, useEffect, StrictMode } from 'react';
import './App.css';
import Clock from './Clock';

function App() {
  const [entryTime, setEntryTime] = useState('');
  const [pauseDuration, setPauseDuration] = useState(30);
  const [workingHours, setWorkingHours] = useState(7);
  const [exitTime, setExitTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [extraTime, setExtraTime] = useState(null);
  const [salary, setSalary] = useState('');
  const [extraTimeValue, setExtraTimeValue] = useState(null);

  useEffect(() => {
    generateRandomTextBackground();
  }, []);

  useEffect(() => {
    let interval;
    if (exitTime) {
      interval = setInterval(() => {
        updateTimeLeft();
      });
    }
    return () => clearInterval(interval);
  }, [exitTime]);

  useEffect(() => {
    calculateExtraTimeValue();
  }, [extraTime, salary]);

  const generateRandomTextBackground = () => {
    const container = document.querySelector('.text-background');
    const numTextItems = 20;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    for (let i = 0; i < numTextItems; i++) {
      const textItem = document.createElement('div');
      textItem.classList.add('text-item');
      textItem.textContent = 'Wind Consulting Tunisia';
      
      const randomX = Math.random() * screenWidth;
      const randomY = Math.random() * screenHeight;
      const randomRotation = Math.random() * 360;

      textItem.style.left = `${randomX}px`;
      textItem.style.top = `${randomY}px`;
      textItem.style.setProperty('--rotate-degree', randomRotation);

      container.appendChild(textItem);
    }
  };

  const calculateExitTime = () => {
    if (entryTime) {
      const [hours, minutes] = entryTime.split(':');
      const entryDate = new Date();
      entryDate.setHours(parseInt(hours));
      entryDate.setMinutes(parseInt(minutes));

      const exitDate = new Date(
        entryDate.getTime() + workingHours * 60 * 60 * 1000 + pauseDuration * 60 * 1000
      );
      const exitHours = exitDate.getHours().toString().padStart(2, '0');
      const exitMinutes = exitDate.getMinutes().toString().padStart(2, '0');

      setExitTime(`${exitHours}:${exitMinutes}`);
    }
  };

  const updateTimeLeft = () => {
    if (exitTime) {
      const [exitHours, exitMinutes] = exitTime.split(':');
      const now = new Date();
      const exitDate = new Date();
      exitDate.setHours(parseInt(exitHours));
      exitDate.setMinutes(parseInt(exitMinutes));
      exitDate.setSeconds(0);
      
      const timeDifference = exitDate - now;
  
      if (timeDifference > 0) {
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        setExtraTime(null);
        setExtraTimeValue(null);
      } else {
        const extraTime = Math.abs(timeDifference) - (30 * 60 * 1000);
        if (extraTime > 0) {
          const hours = Math.floor(extraTime / (1000 * 60 * 60));
          const minutes = Math.floor((extraTime % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((extraTime % (1000 * 60)) / 1000);
  
          setExtraTime(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setExtraTime('No extra time beyond the initial 30 minutes.');
        }
        
        setTimeLeft(null);
      }
    }
  };

  const calculateExtraTimeValue = () => {
    if (salary && extraTime) {
      const monthlySalary = parseFloat(salary);
      const workDays = 22;
      const hourlyRate = monthlySalary / (workDays * workingHours);

      const extraTimeInHours = parseFloat(extraTime.split('h')[0]) + parseFloat(extraTime.split('h')[1]) / 60;
      const extraTimeValue = hourlyRate * extraTimeInHours;

      setExtraTimeValue(extraTimeValue.toFixed(2));
    }
  };

  const reset = () => {
    setEntryTime('');
    setPauseDuration(30); 
    setWorkingHours(7);
    setExitTime(null);
    setTimeLeft(null);
    setExtraTime(null);
    setSalary('');
    setExtraTimeValue(null);
  };

  return (
    <>
      <div className="text-background"></div>
      <div className="app-container">
        <h1>Office Exit Time Calculator</h1>
    <Clock />
        <div className="input-container">
          <label htmlFor="entry-time">Enter Office Time (HH:MM):</label>
          <input
            id="entry-time"
            type="time"
            value={entryTime}
            onChange={(e) => setEntryTime(e.target.value)}
          />
        </div>
        <div className="input-container">
          <label htmlFor="pause-duration">Pause Duration (min, min: 30):</label>
          <input
            id="pause-duration"
            type="number"
            min="30"
            value={pauseDuration}
            onChange={(e) => setPauseDuration(Math.max(30, e.target.value))}
          />
        </div>
        <div className="input-container">
          <label htmlFor="working-hours">Working Hours per Day:</label>
          <input
            id="working-hours"
            type="number"
            min="1"
            value={workingHours}
            onChange={(e) => setWorkingHours(Math.max(1, e.target.value))}
          />
        </div>
        <div className="input-container">
          <label htmlFor="salary">Monthly Salary (TND):</label>
          <input
            id="salary"
            type="number"
            min="0"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
        </div>
        <button onClick={calculateExitTime}>Calculate Exit Time</button>
        {exitTime && (
          <div className="result-container">
            <h2>You can leave the office at: {exitTime}</h2>
            {extraTime && <h3>Extra time: {extraTime}</h3>}
            {timeLeft && <h3>Time left to go home: {timeLeft}</h3>}
            {extraTimeValue !== null && (
              <h3>Overtime Pay: {extraTimeValue} TND</h3>
            )}
            <button className={`reset ${exitTime ? 'show' : ''}`} onClick={reset}>Reset</button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
