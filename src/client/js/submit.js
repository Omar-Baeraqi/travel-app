import { getInfo } from './app'

const button = document.getElementById("generate");
button.addEventListener('click', (e) => {
    getInfo(e);
})

export {
    button
}