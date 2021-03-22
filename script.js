import "./tooltip.js"

document.addEventListener("keydown", (e) => {
  const container = document.querySelector(".container")

  switch (e.key) {
    case "ArrowLeft":
      container.classList.replace("x-center", "x-left")
      container.classList.replace("x-right", "x-center")
      break
    case "ArrowRight":
      container.classList.replace("x-center", "x-right")
      container.classList.replace("x-left", "x-center")
      break
    case "ArrowUp":
      container.classList.replace("y-center", "y-top")
      container.classList.replace("y-bottom", "y-center")
      break
    case "ArrowDown":
      container.classList.replace("y-center", "y-bottom")
      container.classList.replace("y-top", "y-center")
      break
  }
})

const settings = document.querySelector('.settings')
const form = document.querySelector('.settings-modal')
const element = document.querySelector('[data-tooltip]')
const properties = ['spacing', 'tooltip', 'bgColor', 'fgColor', 'positions', 'fontSize', 'arrowSize', 'arrow', 'arrowDirection']

settings.addEventListener('click', e => {
  document.body.classList.add('open-settings')

  properties.forEach(p => {
    form.querySelector(`#${p}`).value = element.dataset[p]
  })
})

form.addEventListener('submit', e => {
  e.preventDefault()

  properties.forEach(p => {
    element.dataset[p] = form.querySelector(`#${p}`).value
  })

  document.body.classList.remove('open-settings')
})