import type { Clock } from "./types";

/**
 * clockdown_function() (includes/template_functions.php): the flip-digit
 * countdown the theme's timer script (tefl_countdown_timer) animates. Once the
 * time has passed at render, the template prints all-zero digits instead.
 */
const GROUPS: [string, string, string][] = [
  ["clock-day", "tenday", "day"],
  ["clock-hour", "tenhour", "hour"],
  ["clock-min", "tenmin", "min"],
  ["clock-sec", "tensec", "sec"],
];

export default function Clockdown({ clock }: { clock: Clock }) {
  return (
    <div className="tefl_countdown_timer">
      <input type="hidden" className="tefl_countdown_timer_value" value={clock.value} />
      <div className="clock">
        {GROUPS.map(([group, ten, one]) => (
          <div className={group} key={group}>
            <Digit name={ten} active={clock.active} />
            <Digit name={one} active={clock.active} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Digit({ name, active }: { name: string; active: boolean }) {
  if (!active) {
    return (
      <div className={`digit ${name}`}>
        <span className="base">0</span>
      </div>
    );
  }
  return (
    <div className={`digit ${name}`}>
      <span className="base"></span>
      <div className="flap over front"></div>
      <div className="flap over back"></div>
      <div className="flap under"></div>
    </div>
  );
}
