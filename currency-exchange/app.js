const randomTickTime = _ => 2000 * (1 + Math.random())

const sign = _ => Math.random() < 0.5 ? 1 : -1
const randomDelta = _ => Math.random() * 0.001 * sign()

const initialCash = 100000
const initialRates = {
  USD: 4.00535115,
  EUR: 4.23939572,
  GBP: 4.99995995,
  CHF: 3.97592784
} // 11.04.2017, whatever :)

const
  $cashInput = document.getElementById('cash-input'),
  updateLabel = label => newValue => label.innerHTML = newValue
  $USDRateLabel = document.getElementById('usd-rate'),
  $EURRateLabel = document.getElementById('eur-rate'),
  $GBPRateLabel = document.getElementById('gbp-rate'),
  $CHFRateLabel = document.getElementById('chf-rate'),
  USDRateLabelUpdate = updateLabel($USDRateLabel),
  EURRateLabelUpdate = updateLabel($EURRateLabel),
  GBPRateLabelUpdate = updateLabel($GBPRateLabel),
  CHFRateLabelUpdate = updateLabel($CHFRateLabel),
  $USDExchangeLabel = document.getElementById('usd-exchange'),
  $EURExchangeLabel = document.getElementById('eur-exchange'),
  $GBPExchangeLabel = document.getElementById('gbp-exchange'),
  $CHFExchangeLabel = document.getElementById('chf-exchange'),
  USDExchangeLabelUpdate = updateLabel($USDExchangeLabel),
  EURExchangeLabelUpdate = updateLabel($EURExchangeLabel),
  GBPExchangeLabelUpdate = updateLabel($GBPExchangeLabel),
  CHFExchangeLabelUpdate = updateLabel($CHFExchangeLabel)

$cashInput.value = 100000;

const createDeltaObservable = currency => 
  Rx.Observable.create(observer => {
    let id;
    const tick = _ => setTimeout(_ => {
      observer.next(randomDelta())
      console.info('tick', currency)
      id = tick()
    }, randomTickTime())
    tick()
    return _ => clearTimeout(id)
  })

////////////////////////////////////////////////////////////////////

const toFixed = digits =>
  value => (value).toFixed(digits)
const to2 = toFixed(2), to4 = toFixed(4)

const exchange = (cash, rate) => cash / rate

const USDRateUpdate$ = createDeltaObservable('USD')
  .scan((current, delta) => current + delta, initialRates.USD)
  .startWith(initialRates.USD)
  .publish()

const EURRateUpdate$ = createDeltaObservable('EUR')
  .scan((current, delta) => current + delta, initialRates.EUR)
  .startWith(initialRates.EUR)
  .publish()

const GBPRateUpdate$ = createDeltaObservable('GBP')
  .scan((current, delta) => current + delta, initialRates.GBP)
  .startWith(initialRates.GBP)
  .publish()

const CHFRateUpdate$ = createDeltaObservable('CHF')
  .scan((current, delta) => current + delta, initialRates.CHF)
  .startWith(initialRates.CHF)
  .publish()

USDRateUpdate$.map(to4).subscribe(USDRateLabelUpdate)
EURRateUpdate$.map(to4).subscribe(EURRateLabelUpdate)
GBPRateUpdate$.map(to4).subscribe(GBPRateLabelUpdate)
CHFRateUpdate$.map(to4).subscribe(CHFRateLabelUpdate)

const cashInputChange$ = Rx.Observable.fromEvent($cashInput, 'change')
  .map(e => e.target.value)
  .startWith(initialCash)

cashInputChange$
  .combineLatest(USDRateUpdate$, exchange)
  .map(to2)
  .subscribe(USDExchangeLabelUpdate)

cashInputChange$
  .combineLatest(EURRateUpdate$, exchange)
  .map(to2)
  .subscribe(EURExchangeLabelUpdate)

cashInputChange$
  .combineLatest(GBPRateUpdate$, exchange)
  .map(to2)
  .subscribe(GBPExchangeLabelUpdate)

cashInputChange$
  .combineLatest(CHFRateUpdate$, exchange)
  .map(to2)
  .subscribe(CHFExchangeLabelUpdate)

USDRateUpdate$.connect()
EURRateUpdate$.connect()
GBPRateUpdate$.connect()
CHFRateUpdate$.connect()
