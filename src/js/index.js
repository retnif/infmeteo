import '../styles/vendor.css'
import '../styles/style.css'

import cityList from '../assets/city.list.json'

const searchCity = async (cityId) => {
  try {
    document.querySelector('.package-name').textContent = 'Loading...'
    const resp = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=913403422b0da0fe79505f630d5331d2`
    )
    const data = await resp.json()

    console.log(data)
    document.querySelector('.package-name').textContent = data.name

    const temp = Math.round(data.main.temp - 273)
    document.querySelector('.price').innerHTML = `${temp}&deg;`
    document.querySelector('.disclaimer').textContent = data.weather[0].description

    const imgTag = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">`
    document.querySelector('.features li').innerHTML = imgTag
  } catch (err) {
    console.log(err)
  }
}

const autocompleteCity = (searchText) => {
  const matchedCity = cityList
    .filter(({ name }) => name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
    .slice(0, 5)

  const htmlMatched = matchedCity.map(({ name, id }) => {
    const pItem = document.createElement('button')
    pItem.innerText = name
    pItem.onclick = () => searchCity(id)
    return pItem
  })
  console.log(htmlMatched)

  const autoBox = document.querySelector('.autobox')
  while (autoBox.firstChild) {
    autoBox.removeChild(autoBox.lastChild)
  }
  htmlMatched.forEach((item) => {
    autoBox.appendChild(item)
  })
}

const search = document.querySelector('#autoComplete')
search.addEventListener('input', () => autocompleteCity(search.value))
