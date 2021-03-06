const animationSpeed = 1000;
const cycleTimeout = 2000;
const visibleCount = 3;
const texts = NYTIMES;

const delay = (time) => new Promise((resolve, reject) => {
    setTimeout(resolve, time);
});

$(document).ready(function(){
    const $container = $("#container");
    function headline(title, hidden){
        var $el = $(`<div class="headline">${title}</div>`);
        if (hidden) {
            $el.css('display', 'none');
        }
        // $container.append($el);
        return $el;
    }

    function hide($el){
        return new Promise((resolve, reject) => {
            $el.hide(animationSpeed);
            $el.promise().then(() => {
                $el.detach();
                resolve();
            });
        });
    }

    function show($el){
        return new Promise((resolve, reject) => {
            $container.append($el);
            $el.show(animationSpeed);
            $el.promise().then(() => {
                resolve();
            });
        });
    }

    const len = texts.length;
    $texts = texts.map((t,i) => headline(t, i >= visibleCount));
    $texts.slice(0, visibleCount).forEach(t => {
        $container.append(t)
    });

    let first = 0, last = visibleCount;
    const inc = value => (value + 1) % len;

    const cycle = () => {
        return hide($texts[first])
        .then(() => {
            return show($texts[last]);
        })
        .then(() => {
            first = inc(first);
            last = inc(last);
            console.log('updated to', first, last);
        })
        .then(() => {
            return delay(cycleTimeout);
        })
        .then(cycle);
    };

    cycle();
});
