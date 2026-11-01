import React from 'react';
import './ThemeToggle.css';

export default function ThemeToggle({ isDark, onToggle }) {
  return (
    <div className="sun-moon-toggle-wrapper" title={isDark ? "Chuyển sang chế độ Ban ngày ☀️" : "Chuyển sang chế độ Ban đêm 🌙"}>
      <label className="switch">
        <span className="track">
          <span className="stars"></span>
          <span className="walker" aria-hidden="true">
            <span className="leg"></span>
            <span className="leg leg--b"></span>
            <span className="body">
              <span className="form form--sun">
                <span className="rays"></span>
                <span className="sun-disc"></span>
                <span className="face">
                  <span className="eye eye--l"></span>
                  <span className="eye eye--r"></span>
                  <span className="cheek cheek--l"></span>
                  <span className="cheek cheek--r"></span>
                  <span className="mouth"></span>
                </span>
              </span>
              <span className="form form--moon">
                <span className="moon-disc"></span>
                <span className="face">
                  <span className="snooze"></span>
                  <span className="cheek"></span>
                  <span className="mouth"></span>
                </span>
              </span>
            </span>
          </span>
          <input
            className="switch__input"
            id="sunmoon"
            type="checkbox"
            role="switch"
            aria-label="Night mode"
            checked={isDark}
            onChange={(e) => onToggle(e.target.checked)}
          />
        </span>
      </label>
    </div>
  );
}
