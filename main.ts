import { Observable } from "rxjs";

const numbers = [1, 5, 10];
const [output, button] = [document.getElementById("output"), document.getElementById("button")];
let clickStream: Observable<MouseEvent> = new Observable();
if (button) {
    clickStream = Observable.fromEvent<MouseEvent>(button, "click");
}

const load = (url: string) => {
    return Observable.defer(() => fetchMovies(url)).retryWhen(retryObservable());
    // return new Observable<Array<{ title: string }>>(obs => {
    //     fetchMovies(url).then(movieList => (obs.next(movieList), obs.complete())).catch(err => obs.error(err));
    // }).retryWhen(retryObservable);
};

const retryObservable = (maxRetries: number = 5, delayMs: number = 1000) => (errObs: Observable<any>) =>
    errObs
        .scan<number>((acc, val) => {
            acc++;
            if (acc < maxRetries) {
                return acc;
            } else {
                throw val;
            }
        }, 0)
        .delay(delayMs);

const fetchMovies = (url: string) =>
    fetch(url)
        .then(res => (res.status === 200 ? res.text() : Promise.reject(`Server returned ${res.status}`)))
        .then(txt => JSON.parse(txt) as Array<{ title: string }>);

const renderMovies = (m: { title: string }) => {
    const div = document.createElement("div");
    div.innerText = m.title;
    output && output.appendChild(div);
};

const logError = (err: any) => console.log(`Error: ${err}`);

const logComplete = () => console.log(`Completed!`);

clickStream
    .flatMap(val => load("moviess.json"))
    .flatMap(movieList => Observable.from(movieList))
    .subscribe(renderMovies, logError, logComplete);
