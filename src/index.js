import './styles/normalize.css';
import './styles/style.min.css';

const color = document.querySelectorAll('.colors__color');

color.forEach(item => {
	item.addEventListener('click', e => console.log(e))
});