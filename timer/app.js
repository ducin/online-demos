const $restart = document.getElementById('restart');
const $pause = document.getElementById('pause');
const $resume = document.getElementById('resume');

const $tick01 = document.getElementById('tick01');
const $tick025 = document.getElementById('tick025');
const $tick05 = document.getElementById('tick05');
const $tick1 = document.getElementById('tick1');

const $timer = document.getElementById('timer');
const setTimerValue = (value) => $timer.innerHTML = value;

const pad = (n) => (n + '').padStart(2, '0')
const formatTime = (seconds) => {
    let h = pad(Math.floor(seconds / 3600))
    let min = pad(Math.floor(seconds / 60))
    let sec = Math.floor(seconds % 60 * 10) / 10 + ''
    let [whole, ...fraction] = sec.split('.')
    whole = pad(whole)
    sec = [whole, ...fraction].join('.')
    return `${h}:${min}:${sec}`
}

const pause$ = Rx.Observable.fromEvent($pause, 'click')
    .mapTo('pause');

const resume$ = Rx.Observable.fromEvent($resume, 'click')
    .startWith(null)
    .mapTo('resume');

const restart$ = Rx.Observable.fromEvent($restart, 'click');

const tick$ = Rx.Observable.merge(
    Rx.Observable.fromEvent($tick01, 'click').startWith(null).mapTo(0.1),
    Rx.Observable.fromEvent($tick025, 'click').mapTo(0.25),
    Rx.Observable.fromEvent($tick05, 'click').mapTo(0.5),
    Rx.Observable.fromEvent($tick1, 'click').mapTo(1)
).switchMap(tickSize => Rx.Observable.interval(1000 * tickSize).mapTo(tickSize))
// following 2 lines prevent resetting chosen tickSize - tick$ gets super hot, it's multicasted and connection is kept even if noone is subscribing
.publish()
tick$.connect()

// const tick$ = (tickSize) => Rx.Observable.interval(1000 * tickSize).mapTo(tickSize)

const initialTime = 0;
const countDown = (time, tick) => time - tick;
const countUp = (time, tick) => time + tick;

const timer$ = Rx.Observable.merge(pause$, resume$)
    .switchMap(command => command === 'pause' ? Rx.Observable.empty() : tick$)
    .scan(countUp, initialTime)
    .takeWhile(v => v > 0)
    .map(formatTime)

restart$.switchMap(_ => timer$)
    .subscribe(setTimerValue)

setTimerValue(formatTime(initialTime));
