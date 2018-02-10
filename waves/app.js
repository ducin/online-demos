// for more info on using Waves, see: http://fian.my.id/Waves/#api
var config = {
    duration: 500,
};
Waves.init(config);
Waves.attach('.button', ['waves-button', 'waves-float']);

const $btn = document.getElementById('btn');
const $intervalInc = document.getElementById('intervalInc');
const $intervalDec = document.getElementById('intervalDec');

const $intervalBox = document.getElementById('intervalBox');
const setIntervalValue = (value) => $intervalBox.innerHTML = `interval: ${value}`;
const $clickCountBox = document.getElementById('clickCountBox');
const setClickCountValue = (value) => $clickCountBox.innerHTML = `clicked: ${value}`;

const $interval1s = document.getElementById('interval1s');
const $interval2s = document.getElementById('interval2s');

const $item1check = document.getElementById('item1check');
const $item2check = document.getElementById('item2check');
const $item3check = document.getElementById('item3check');
const $item4check = document.getElementById('item4check');
const $item5check = document.getElementById('item5check');
const $item6check = document.getElementById('item6check');

const waveAll = () => Waves.ripple('.button');
const waveItem = (idx) =>
	() => Waves.ripple(`#item${idx}box`);
const wave1 = waveItem(1),
	wave2 = waveItem(2),
	wave3 = waveItem(3),
	wave4 = waveItem(4),
	wave5 = waveItem(5),
	wave6 = waveItem(6)

const intervalValue = 500;

//////////////////////////////////////////////////////////

let { Observable, Subject } = Rx

const fireClick$ = Observable.fromEvent($btn, 'click')

fireClick$
    .startWith(0)
    .scan((count, _) => count+1)
    .subscribe(setClickCountValue)

const interval1sChosen$ = Observable.fromEvent($interval1s, 'click').mapTo(1000)
const interval2sChosen$ = Observable.fromEvent($interval2s, 'click').mapTo(2000)

const intervalInc$ = Observable.fromEvent($intervalInc, 'click').mapTo(200)
const intervalDec$ = Observable.fromEvent($intervalDec, 'click').mapTo(-200)

const fromCheckbox = (checkboxNode) =>
    Observable.fromEvent(checkboxNode, 'click')
        .map(e => e.target.checked)
        .startWith(checkboxNode.checked)

const filterLatest = (filterObs$) =>
    (obs$) => obs$
        .withLatestFrom(filterObs$, (tick, checked) => ({ tick, checked }))
        .filter(obj => obj.checked)

// let intervalSize$ = Observable.merge(intervalInc$, intervalDec$)
//     .startWith(intervalValue)
//     .scan((size, delta) => size + delta)

// let intervalSize$ = Observable.merge(interval1sChosen$, interval2sChosen$)

let intervalSize$ = Observable.merge(interval1sChosen$, interval2sChosen$)
    .startWith(intervalValue)
    .switchMap(v /*1000,2000*/ => Observable.of(v)
        .merge(intervalInc$, intervalDec$)
        .scan((sum, change) => sum + change)
    )
    .distinctUntilChanged()
    .publish()

const item1checked$ = fromCheckbox($item1check)
const item2checked$ = fromCheckbox($item2check)
const item3checked$ = fromCheckbox($item3check)
const item4checked$ = fromCheckbox($item4check)
const item5checked$ = fromCheckbox($item5check)
const item6checked$ = fromCheckbox($item6check)

let wave$ = intervalSize$
    .switchMap(intervalSize => Observable.interval(intervalSize))
    .merge(fireClick$)
    .share()

wave$
    .let(filterLatest(item1checked$))
    .subscribe(wave1)

wave$
    .let(filterLatest(item2checked$))
    .subscribe(wave2)

wave$
    .let(filterLatest(item3checked$))
    .subscribe(wave3)

wave$
    .let(filterLatest(item4checked$))
    .subscribe(wave4)

wave$
    .let(filterLatest(item5checked$))
	.subscribe(wave5)
	
wave$
    .let(filterLatest(item6checked$))
	.subscribe(wave6)

intervalSize$.subscribe(setIntervalValue)

intervalSize$.connect()
