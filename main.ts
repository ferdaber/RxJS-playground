import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { Observable } from 'rxjs/Observable';

const numbers = [1, 5, 10];
const source = new Observable<number>(obs => {
    let idx = 0;
    const produceValue = () => {
        obs.next(numbers[idx++]);

        if (idx < numbers.length) {
            setTimeout(produceValue, 250);
        } else {
            obs.complete();
        }
    };

    produceValue();
})
    .map(n => n * 2)
    .filter(n => n > 2);

source.subscribe(
    val => console.log(`Value: ${val}`),
    err => console.log(`Error: ${err}`),
    () => console.log(`Completed!`)
);
