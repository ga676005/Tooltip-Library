const DEFAULT_SPACING = 0
const POSITION_ORDER = ['topRight', 'topLeft', 'bottomLeft', 'bottomRight', 'top', 'bottom', 'left', 'right']
const POSITION_TO_FUNCTION_MAP = {
  bottomLeft: positionTooltipBottomLeft,
  bottomRight: positionTooltipBottomRight,
  topLeft: positionTooltipTopLeft,
  topRight: positionTooltipTopRight,
  top: positionTooltipTop,
  bottom: positionTooltipBottom,
  left: positionTooltipLeft,
  right: positionTooltipRight
}

const tooltipContainer = document.createElement('div')
tooltipContainer.classList.add('tooltip-container')
document.body.append(tooltipContainer)

document.addEventListener('mouseover', (e) => {
  const element = e.target
  if (!element.matches('[data-tooltip]')
    || element.dataset.tooltip.trim() === '') return

  tooltipContainer.innerHTML = creatTooltipHTML(e.target.dataset)
  const tooltip = tooltipContainer.children[0]
  setupTooltipStyle(e.target)
  positionTooltip(tooltip, e.target)

  e.target.addEventListener(
    'mouseleave',
    () => {
      tooltip.remove()
    },
    { once: true }
  )
})

function creatTooltipHTML({ tooltip, arrow = "&#10148;" } = {}) {
  return `
  <div class="tooltip-outer">
    <div class="tooltip">${tooltip}</div>
    <div class="tooltip-arrow tooltip-arrow-top ">${arrow}</div>
    <div class="tooltip-arrow tooltip-arrow-right">${arrow}</div>
    <div class="tooltip-arrow tooltip-arrow-bottom">${arrow}</div>
    <div class="tooltip-arrow tooltip-arrow-left">${arrow}</div>
    <div class="tooltip-arrow tooltip-arrow-bottom-left">${arrow}</div>
    <div class="tooltip-arrow tooltip-arrow-top-right">${arrow}</div>
    <div class="tooltip-arrow tooltip-arrow-top-left">${arrow}</div>
    <div class="tooltip-arrow tooltip-arrow-bottom-right">${arrow}</div>
  </div>`
}

function positionTooltip(tooltip, element) {
  const elementRect = element.getBoundingClientRect()
  const preferredPositions = (element.dataset.positions || '').split('|')
  const spacing = element.dataset.spacing ? parseInt(element.dataset.spacing) : DEFAULT_SPACING
  const positions = [...preferredPositions, ...POSITION_ORDER]

  for (let i = 0; i < positions.length; i++) {
    const func = POSITION_TO_FUNCTION_MAP[positions[i]]
    if (func?.(tooltip, elementRect, spacing)) return
  }
}

function isLessThanSpacing(tooltip, position, spacing) {
  const pos = getComputedStyle(tooltip)[position]
  const posValue = parseFloat(pos.substring(0, pos.length - 2))
  return posValue < spacing
}

function positionTooltipTop(tooltip, elementRect, spacing) {
  const tooltipRect = tooltip.getBoundingClientRect()
  const arrowToShow = 'bottom'

  tooltip.style.top = `${elementRect.top - tooltipRect.height - spacing}px`
  tooltip.style.left = `${elementRect.left + elementRect.width / 2 - tooltipRect.width / 2}px`

  const bounds = isOutOfBound(tooltip, spacing)
  if (bounds.top) {
    resetTooltipPosition(tooltip)
    return false
  }

  showTooltipArrow(arrowToShow)

  if (bounds.right) {
    tooltip.style.right = `${spacing}px`
    tooltip.style.left = 'initial'
    tooltip.style.setProperty('--left', `${tooltipRect.width - elementRect.width + spacing}px`)

    if (isLessThanSpacing(tooltip, 'left', spacing)) {
      tooltip.style.left = `${spacing}px`
    }
    repositionArrow(tooltip, arrowToShow, 'justify-self', "end")
  }

  if (bounds.left) {
    tooltip.style.left = `${spacing}px`
    tooltip.style.setProperty('--left', `${elementRect.width - spacing}px`)

    if (isLessThanSpacing(tooltip, 'right', spacing)) {
      tooltip.style.right = `${spacing}px`
    }

    repositionArrow(tooltip, arrowToShow, 'justify-self', "start")
  }

  return true
}

function positionTooltipBottom(tooltip, elementRect, spacing) {
  const tooltipRect = tooltip.getBoundingClientRect()
  const arrowToShow = "top"

  tooltip.style.top = `${elementRect.bottom + spacing}px`
  tooltip.style.left = `${elementRect.left + elementRect.width / 2 - tooltipRect.width / 2}px`

  const bounds = isOutOfBound(tooltip, spacing)

  if (bounds.bottom) {
    resetTooltipPosition(tooltip)
    return false
  }

  showTooltipArrow(arrowToShow)

  if (bounds.right) {
    tooltip.style.right = `${spacing}px`
    tooltip.style.left = 'initial'
    tooltip.style.setProperty('--left', `${tooltipRect.width - elementRect.width + spacing}px`)
    if (isLessThanSpacing(tooltip, 'left', spacing)) {
      tooltip.style.left = `${spacing}px`
    }
    repositionArrow(tooltip, arrowToShow, 'justify-self', "end")
  }

  if (bounds.left) {
    tooltip.style.left = `${spacing}px`
    tooltip.style.setProperty('--left', `${elementRect.width - spacing}px`)
    if (isLessThanSpacing(tooltip, 'right', spacing)) {
      tooltip.style.right = `${spacing}px`
    }
    repositionArrow(tooltip, arrowToShow, 'justify-self', "start")
  }

  return true
}

function positionTooltipLeft(tooltip, elementRect, spacing) {
  const tooltipRect = tooltip.getBoundingClientRect()
  tooltip.style.top = `${elementRect.top + elementRect.height / 2 - tooltipRect.height / 2}px`
  tooltip.style.left = `${elementRect.left - tooltipRect.width - spacing}px`
  const bounds = isOutOfBound(tooltip, spacing)
  const arrowToShow = "right"

  if (bounds.left) {
    resetTooltipPosition(tooltip)
    return false
  }

  showTooltipArrow(arrowToShow)

  if (bounds.bottom) {
    tooltip.style.bottom = `${spacing}px`
    tooltip.style.top = 'initial'
    if (isLessThanSpacing(tooltip, 'top', spacing)) {
      tooltip.style.top = `${spacing}px`
    }
    repositionArrow(tooltip, arrowToShow, "align-self", "end")
  }
  if (bounds.top) {
    tooltip.style.top = `${spacing}px`
    if (isLessThanSpacing(tooltip, 'bottom', spacing)) {
      tooltip.style.bottom = `${spacing}px`
    }
    repositionArrow(tooltip, arrowToShow, "align-self", "start")
  }
  return true
}

function positionTooltipRight(tooltip, elementRect, spacing) {
  const tooltipRect = tooltip.getBoundingClientRect()
  tooltip.style.top = `${elementRect.top + elementRect.height / 2 - tooltipRect.height / 2}px`
  tooltip.style.left = `${elementRect.right + spacing}px`
  const bounds = isOutOfBound(tooltip, spacing)
  const arrowToShow = "left"

  if (bounds.right) {
    resetTooltipPosition(tooltip)
    return false
  }

  showTooltipArrow(arrowToShow)

  if (bounds.bottom) {
    tooltip.style.bottom = `${spacing}px`
    tooltip.style.top = 'initial'
    if (isLessThanSpacing(tooltip, 'top', spacing)) {
      tooltip.style.top = `${spacing}px`
    }
    repositionArrow(tooltip, arrowToShow, 'align-self', "end")
  }
  if (bounds.top) {
    tooltip.style.top = `${spacing}px`
    if (isLessThanSpacing(tooltip, 'bottom', spacing)) {
      tooltip.style.bottom = `${spacing}px`
    }
    repositionArrow(tooltip, arrowToShow, 'align-self', "start")
  }
  return true
}

function isOutOfBound(tooltip, spacing) {
  const rect = tooltip.getBoundingClientRect()
  const containerRect = tooltipContainer.getBoundingClientRect()

  return {
    left: rect.left <= containerRect.left + spacing,
    right: rect.right >= containerRect.right - spacing,
    top: rect.top <= containerRect.top + spacing,
    bottom: rect.bottom >= containerRect.bottom - spacing
  }
}

function resetTooltipPosition(tooltip) {
  tooltip.style.top = 'initial'
  tooltip.style.left = 'initial'
  tooltip.style.right = 'initial'
  tooltip.style.bottom = 'initial'
}

function positionTooltipTopLeft(tooltip, elementRect, spacing) {
  const tooltipRect = tooltip.getBoundingClientRect()

  tooltip.style.top = `${elementRect.top - tooltipRect.height - spacing}px`
  tooltip.style.left = `${elementRect.left - tooltipRect.width}px`

  const bounds = isOutOfBound(tooltip, spacing)
  if (bounds.top || bounds.left) {
    resetTooltipPosition(tooltip)
    return false
  }
  showTooltipArrow('bottom-right')

  return true
}

function positionTooltipTopRight(tooltip, elementRect, spacing) {
  const tooltipRect = tooltip.getBoundingClientRect()

  tooltip.style.top = `${elementRect.top - tooltipRect.height - spacing}px`
  tooltip.style.left = `${elementRect.right}px`

  const bounds = isOutOfBound(tooltip, spacing)
  if (bounds.top || bounds.right) {
    resetTooltipPosition(tooltip)
    return false
  }
  showTooltipArrow('bottom-left')

  return true
}

function positionTooltipBottomRight(tooltip, elementRect, spacing) {
  const tooltipRect = tooltip.getBoundingClientRect()

  tooltip.style.top = `${elementRect.bottom + spacing}px`
  tooltip.style.left = `${elementRect.right + spacing}px`

  const bounds = isOutOfBound(tooltip, spacing)
  if (bounds.bottom || bounds.right) {
    resetTooltipPosition(tooltip)

    return false
  }
  showTooltipArrow('top-left')

  return true
}

function positionTooltipBottomLeft(tooltip, elementRect, spacing) {
  const tooltipRect = tooltip.getBoundingClientRect()

  tooltip.style.top = `${elementRect.bottom + spacing}px`
  tooltip.style.left = `${elementRect.left - tooltipRect.width - spacing}px`

  const bounds = isOutOfBound(tooltip, spacing)
  if (bounds.bottom || bounds.left) {
    resetTooltipPosition(tooltip)
    return false
  }
  showTooltipArrow('top-right')

  return true
}

function showTooltipArrow(direction) {
  const arrow = tooltipContainer.querySelector(`.tooltip-arrow-${direction}`)
  arrow.classList.add('animate-tooltip')
}

function setupTooltipStyle(element) {
  const { bgColor, fgColor, fontSize, arrowSize, spacing = "0", arrowDirection = "right" } = element.dataset
  const ARROW_ROTATE_DEGREE = {
    up: 90,
    down: 270,
    right: 0,
    left: 180
  }
  const degree = `${ARROW_ROTATE_DEGREE[arrowDirection]}deg`
  const start = `var(--arrow-${arrowDirection}-translate-start)`
  const end = `var(--arrow-${arrowDirection}-translate-end)`
  const flashArrow = `flash-arrow-${arrowDirection}`
  const bgDegree = `${ARROW_ROTATE_DEGREE[arrowDirection] - 90}deg`
  const arrow = tooltipContainer.querySelector('.tooltip-arrow')
  const arrowFontSize = parseFloat(getComputedStyle(arrow).getPropertyValue('font-size'))
  const defaultAnimateDuration = 3.5
  const animateDuration = (arrowFontSize / 16) < defaultAnimateDuration
    ? defaultAnimateDuration + 's'
    : (arrowFontSize / 16) + 's'

  const customProperties = {
    '--tooltip-bg-clr': bgColor ? bgColor : "#ffffff",
    '--tooltip-fg-clr': fgColor ? fgColor : "#000000",
    '--tooltip-fs': fontSize ? fontSize : "1rem",
    '--tooltip-arrow-fs': arrowSize ? arrowSize : "1.5rem",
    '--tooltip-base-rotation': degree,
    '--tooltip-spacing': `${spacing / 50}rem`,
    '--arrow-translate-start': start,
    '--arrow-translate-end': end,
    '--flash-arrow': flashArrow,
    '--bg-degree': bgDegree,
    '--animate-duration': animateDuration
  }

  for (const [property, value] of Object.entries(customProperties)) {
    tooltipContainer.style.setProperty(property, value)
  }
}

function repositionArrow(tooltip, arrowDirection, property, value) {
  tooltip.parentElement.querySelector(`.tooltip-arrow-${arrowDirection}`).style.setProperty(property, value)
}