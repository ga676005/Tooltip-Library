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


settings.addEventListener('click', e => {
  document.body.classList.add('open-settings')
  const { spacing, positions, tooltip, bgColor, fgColor, fontSize, arrowSize, arrow, arrowDirection } = element.dataset

  form.querySelector('#spacing').value = spacing
  form.querySelector('#positions').value = positions
  form.querySelector('#tooltip').value = tooltip
  form.querySelector('#bgColor').value = bgColor
  form.querySelector('#fgColor').value = fgColor
  form.querySelector('#fontSize').value = fontSize
  form.querySelector('#arrowSize').value = arrowSize
  form.querySelector('#arrow').value = arrow
  form.querySelector('#arrowDirection').value = arrowDirection

})

form.addEventListener('submit', e => {
  e.preventDefault()

  element.dataset.spacing = form.querySelector('#spacing').value
  element.dataset.positions = form.querySelector('#positions').value
  element.dataset.tooltip = form.querySelector('#tooltip').value
  element.dataset.bgColor = form.querySelector('#bgColor').value
  element.dataset.fgColor = form.querySelector('#fgColor').value
  element.dataset.fontSize = form.querySelector('#fontSize').value
  element.dataset.arrowSize = form.querySelector('#arrowSize').value
  element.dataset.arrow = form.querySelector('#arrow').value
  element.dataset.arrowDirection = form.querySelector('#arrowDirection').value

  document.body.classList.remove('open-settings')
})