let numbers = ["88", "67", "23", "31", "61", "11", "07", "87", "15", "69"];

document.addEventListener("DOMContentLoaded", () => {
    numbers.forEach(n => $("numbers").add($new("num").add(n)));
    Array.from({length: 10}, () => $("buckets").add($new("bucket")));
    refresh(0);
});
window.addEventListener("resize", () => refresh(0));

let time = new antica.Time();
let controls = new antica.Controls(time, {
    next: ["Space", "Right", "Down", "Page Down"],
    previous: ["Backspace", "Delete", "Left", "Up", "Page Up"],
});

let refresh = (duration = 500) => {
    let a = placed + !!step;
    let filled = {};
    numbers.forEach((n, i) => {
        if (i < a) {
            if (step == 1 && i + 1 == a) {
                $("num", i).style({left: `${window.innerWidth / 2 + window.innerWidth * .035 * (i - (numbers.length + a - 1) / 2)}px`, top: "33vh"}, duration);
            } else {
                filled[n[0]] |= 0;
                if (step == 2 && i + 1 == a) {
                    $("num", i).style({left: `${window.innerWidth / 2 + window.innerWidth * .085 * (n[0] - 5) + window.innerWidth * .025}px`, top: "45vh"}, duration);
                } else {
                    $("num", i).style({left: `${window.innerWidth / 2 + window.innerWidth * .085 * (n[0] - 5) + window.innerWidth * .025}px`, top: `${window.innerHeight * .55 + window.innerWidth * (.065 - filled[n[0]] * .025)}px`}, duration);
                }
                filled[n[0]]++;
            }
        } else {
            $("num", i).style({left: `${window.innerWidth / 2 + window.innerWidth * .035 * (i - (numbers.length + a) / 2)}px`, top: "20vh"}, duration);
        }
    });
    Array.from({length: 10}, (_, i) => $("bucket", i).style({left: `${window.innerWidth / 2 + window.innerWidth * .085 * (i - numbers.length / 2)}px`, top: "55vh"}));
};

let placed = 0;
let step = 0;

let nextStep = () => {
    if (++step > 2) {
        step = 0;
        placed++;
    }
    if (placed > numbers.length || placed == numbers.length && step > 0) {
        step = 0;
        placed = numbers.length;
    }
    refresh();
    wait();
};
let previousStep = () => {
    if (--step < 0) {
        step = 2;
        if (--placed < 0) {
            step = 0;
            placed = 0;
        }
    }
    refresh();
    wait();
};

let waitFor = (callbacks = {}) => time.repeat(() => {
    controls.update();
    Object.keys(callbacks).forEach(control => {
        if (controls.activeControls[control]?.pressed) {
            time.stopRepeating();
            callbacks[control]();
        }
    });
});
let wait = () => waitFor({next: nextStep, previous: previousStep});
wait();
