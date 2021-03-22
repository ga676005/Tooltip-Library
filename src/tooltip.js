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

  tooltip.style.top = `${elementRect.top - tooltipRect.height - spacing}px`
  tooltip.style.left = `${elementRect.left + elementRect.width / 2 - tooltipRect.width / 2}px`

  const bounds = isOutOfBound(tooltip, spacing)
  if (bounds.top) {
    resetTooltipPosition(tooltip)
    return false
  }

  positionTooltipArrow('bottom')

  if (bounds.right) {
    tooltip.style.right = `${spacing}px`
    tooltip.style.left = 'initial'
    tooltip.style.setProperty('--left', `${tooltipRect.width - elementRect.width + spacing}px`)

    if (isLessThanSpacing(tooltip, 'left', spacing)) {
      tooltip.style.left = `${spacing}px`
    }
  }

  if (bounds.left) {
    tooltip.style.left = `${spacing}px`
    tooltip.style.setProperty('--left', `${elementRect.width - spacing}px`)

    if (isLessThanSpacing(tooltip, 'right', spacing)) {
      tooltip.style.right = `${spacing}px`
    }
  }

  return true
}

function positionTooltipBottom(tooltip, elementRect, spacing) {
  const tooltipRect = tooltip.getBoundingClientRect()

  tooltip.style.top = `${elementRect.bottom + spacing}px`
  tooltip.style.left = `${elementRect.left + elementRect.width / 2 - tooltipRect.width / 2}px`

  const bounds = isOutOfBound(tooltip, spacing)

  if (bounds.bottom) {
    resetTooltipPosition(tooltip)
    return false
  }

  positionTooltipArrow('top')

  if (bounds.right) {
    tooltip.style.right = `${spacing}px`
    tooltip.style.left = 'initial'
    tooltip.style.setProperty('--left', `${tooltipRect.width - elementRect.width + spacing}px`)
    if (isLessThanSpacing(tooltip, 'left', spacing)) {
      tooltip.style.left = `${spacing}px`
    }
  }

  if (bounds.left) {
    tooltip.style.left = `${spacing}px`
    tooltip.style.setProperty('--left', `${elementRect.width - spacing}px`)
    if (isLessThanSpacing(tooltip, 'right', spacing)) {
      tooltip.style.right = `${spacing}px`
    }
  }

  return true
}

function positionTooltipLeft(tooltip, elementRect, spacing) {
  const tooltipRect = tooltip.getBoundingClientRect()
  tooltip.style.top = `${elementRect.top + elementRect.height / 2 - tooltipRect.height / 2}px`
  tooltip.style.left = `${elementRect.left - tooltipRect.width - spacing}px`
  const bounds = isOutOfBound(tooltip, spacing)

  if (bounds.left) {
    resetTooltipPosition(tooltip)
    return false
  }

  positionTooltipArrow('right')

  if (bounds.bottom) {
    tooltip.style.bottom = `${spacing}px`
    tooltip.style.top = 'initial'
    if (isLessThanSpacing(tooltip, 'top', spacing)) {
      tooltip.style.top = `${spacing}px`
    }
  }
  if (bounds.top) {
    tooltip.style.top = `${spacing}px`
    if (isLessThanSpacing(tooltip, 'bottom', spacing)) {
      tooltip.style.bottom = `${spacing}px`
    }
  }
  return true
}

function positionTooltipRight(tooltip, elementRect, spacing) {
  const tooltipRect = tooltip.getBoundingClientRect()
  tooltip.style.top = `${elementRect.top + elementRect.height / 2 - tooltipRect.height / 2}px`
  tooltip.style.left = `${elementRect.right + spacing}px`
  const bounds = isOutOfBound(tooltip, spacing)

  if (bounds.right) {
    resetTooltipPosition(tooltip)
    return false
  }

  positionTooltipArrow('left')

  if (bounds.bottom) {
    tooltip.style.bottom = `${spacing}px`
    tooltip.style.top = 'initial'
    if (isLessThanSpacing(tooltip, 'top', spacing)) {
      tooltip.style.top = `${spacing}px`
    }
  }
  if (bounds.top) {
    tooltip.style.top = `${spacing}px`
    if (isLessThanSpacing(tooltip, 'bottom', spacing)) {
      tooltip.style.bottom = `${spacing}px`
    }
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
  positionTooltipArrow('bottom-right')

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
  positionTooltipArrow('bottom-left')

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
  positionTooltipArrow('top-left')

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
  positionTooltipArrow('top-right')

  return true
}

function positionTooltipArrow(direction) {
  const arrow = tooltipContainer.querySelector(`.tooltip-arrow-${direction}`)
  arrow.classList.add('animate-tooltip')
}

function setupTooltipStyle(element) {
  const { bgColor, fgColor, fontSize, arrowSize, spacing = "0", arrowDirection = "right" } = element.dataset
  const ARROW_ROTATE_DEGREE = {
    up: "90deg",
    down: "270deg",
    right: "0deg",
    left: "180deg"
  }
  const degree = ARROW_ROTATE_DEGREE[arrowDirection]
  const start = `var(--arrow-${arrowDirection}-translate-start)`
  const end = `var(--arrow-${arrowDirection}-translate-end)`

  tooltipContainer.style.setProperty('--tooltip-bg-clr', bgColor ? bgColor : "#ffffff")
  tooltipContainer.style.setProperty('--tooltip-fg-clr', fgColor ? fgColor : "#000000")
  tooltipContainer.style.setProperty('--tooltip-fs', fontSize ? fontSize : "1rem")
  tooltipContainer.style.setProperty('--tooltip-arrow-fs', arrowSize ? arrowSize : "1.5rem")
  tooltipContainer.style.setProperty('--tooltip-base-rotation', degree)
  tooltipContainer.style.setProperty('--tooltip-spacing', `${spacing / 50}rem`)
  tooltipContainer.style.setProperty('--arrow-translate-start', start)
  tooltipContainer.style.setProperty('--arrow-translate-end', end)
}