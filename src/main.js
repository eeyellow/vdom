import createElement from './vdom/createElement'
import render from './vdom/render'
import mount from './vdom/mount'
import diff from './vdom/diff'

const createVApp = (count) => createElement('div', {
    attrs: {
        id: 'app',
        dataCount: count,
    },
    children: [
        createElement('input'),
        String(count),
        createElement('img', {
            attrs: {
                src: 'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif',
            },
        }),
    ]
})

let count = 0;
let vApp = createVApp(count);
const app = render(vApp);
let rootEl = mount(app, document.querySelector('#app'))

setInterval(() => {
    count++;
    const vNewApp = createVApp(count);
    const patch = diff(vApp, vNewApp);
    rootEl = patch(rootEl);
    vApp = vNewApp;
}, 1000);

console.log(app)