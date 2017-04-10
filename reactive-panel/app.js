
const $username = $('#autocomplete-username')
const $results = $('#autocomplete-results')

const addSpinner = () => $results.html('').addClass('spinner')
const removeSpinner = () => $results.removeClass('spinner')

const updateAutoComplete = users => {
    var output = users.length ?
        `<ul>${users.map(u => `<li data-id="${u.id}">${u.firstName} ${u.lastName}</li>`).join('')}</ul>`
        : `<i>no results</i>`
    $results.html(output)
}

const usernameInput$ = Rx.Observable.fromEvent($username, 'keyup')
    .map(e => e.target.value)
    .filter(phrase => phrase.length > 1)
    .debounceTime(500)
    .distinctUntilChanged()
    .do(addSpinner)
    .flatMap(
        phrase => Rx.Observable.fromPromise(API.getUsers(phrase))
    )
    .take(10)
    .do(removeSpinner)
    .do(console.log)

const usernameClick$ = Rx.Observable.fromEvent($results, 'click')
    .map(e => $(e.target))
    .filter(target => target.data('id'))
    .map(target => target.data('id'))
    .subscribe(console.log)

usernameInput$.subscribe(
    updateAutoComplete,
    console.error,
    _ => console.info('completed')
)

///////////////////////////////////////////////////////////////////////////

const speed = 1000;
const pickRandom = list => list[Math.floor(Math.random() * list.length)]

let users = [];
API.getUsers().then(res => users = res); // dirty hack; available after promise resolves 
const pickRandomUser = _ => pickRandom(users)

const userBlockTpl = u => `<div class="user-block col-md-4">
   <h2>${u.firstName} ${u.lastName}</h2>
   <div><strong>salary</strong>: ${(u.salary).toFixed(2)}</div>
   ${u.bio.split('\n').map(par => `<p>${par}</p>\n`).join('')}
</div>`

const $userBlocks = $('#user-blocks')

const removeUserBlock = block => {
    $(block).hide(speed)
    $(block).promise().then(el => $(el).remove());
}
const removeFirstUserBlock = _ => removeUserBlock($('.user-block')[0])

const addUserBlock = user => {
    var node = $(userBlockTpl(user)).hide(0)
    $userBlocks.append(node)
    node.show(speed)
}

const $userBlockTurnBtn = $('#user-block-turn');

const slideClicked$ = Rx.Observable.fromEvent($userBlockTurnBtn, 'click')
const slideInterval$ = Rx.Observable.interval(3000)

slideUsers$ = Rx.Observable.timer(2000)
    .merge(
        slideClicked$,
        slideInterval$
    )
    .throttleTime(2000)
    .map(pickRandomUser)

slideUsers$.subscribe(
    user => {
        removeFirstUserBlock()
        addUserBlock(user)
    },
    console.error,
    _ => console.info('completed')
)
