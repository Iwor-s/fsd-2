import '@/pages/modules/headers/header-UI.sass'
import '@/pages/colors&type.sass'


const colorList = document.querySelectorAll('.color-item__color')

colorList.forEach(item => {
	item.addEventListener('click', e => console.log(e))
})