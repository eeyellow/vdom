import createElement from './vdom/createElement'
import render from './vdom/render'

const vApp = createElement('div', {
    attrs: {
        id: 'app',
    },
    children: [
        createElement('img', {
            attrs: {
                src: 'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif',
            },
        }),
    ]
})

const app = render(vApp)

console.log(app)