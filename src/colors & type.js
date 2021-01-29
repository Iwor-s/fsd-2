import '@/styles/colors & type.sass';

const color = document.querySelectorAll('.colors__color');

color.forEach(item => {
	item.addEventListener('click', e => console.log(e))
});