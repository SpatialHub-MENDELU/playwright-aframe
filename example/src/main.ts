import { trashItems } from './constants'
import { htmlContent } from './html'
import { generateRandomNumber, isHtmlElementWithObject3D } from './utils'
import './style.css'

const listeners = () => {
  const arMenuElement = document.querySelector('#arMenu')

  trashItems.forEach(trashItem => {
    const trashElement = document.querySelector(`#trash-${trashItem.name}`)
    trashElement?.addEventListener('click', event => {
      const targetElement = event.target
      if (
        !(targetElement instanceof HTMLElement) ||
        targetElement.getAttribute('data-sorted') === 'true'
      ) {
        return
      }
      toggleMenuAbove(event)
    })
  })

  const toggleMenuAbove = (event: Event) => {
    const targetElement = event.target
    if (!isHtmlElementWithObject3D(targetElement)) {
      return
    }
    const targetPosition = targetElement.getAttribute('position')
    if (!targetPosition) {
      return
    }

    targetElement.setAttribute('data-trash-active', targetElement.id)

    const modelObject = targetElement.object3D
    const boundingBox = new window.THREE.Box3().setFromObject(modelObject)
    const centerCoordinates = boundingBox.getCenter(new window.THREE.Vector3())
    const boundingBoxSize = boundingBox.getSize(new window.THREE.Vector3())
    const boundingBoxHeight = boundingBoxSize.y

    const newYPosition = centerCoordinates.y + boundingBoxHeight / 2 + 1.8
    arMenuElement?.setAttribute(
      'position',
      // @ts-expect-error Ignore wrong types
      `${targetPosition.x + generateRandomNumber(-0.5, 0.5)} ${newYPosition} ${targetPosition.z + generateRandomNumber(-0.5, 0.5)}`
    )
    arMenuElement?.setAttribute(
      'visible',
      String(String(arMenuElement?.getAttribute('visible')) !== String(true))
    )
  }

  arMenuElement?.addEventListener('select', event => {
    if (!(event instanceof CustomEvent)) {
      return
    }
    const selectedMenuItem = event.detail
    const selectedMenuItemName = selectedMenuItem.item.title.toLowerCase()
    const activeTrashElement = document.querySelector('[data-trash-active]')
    const selectedTrashElement = document.querySelector(
      `#${activeTrashElement?.getAttribute('data-trash-active')}`
    )
    const targetCrateElement = document.querySelector(`#crate-${selectedMenuItemName}`)

    const getCrateCenterCoordinates = () => {
      if (!isHtmlElementWithObject3D(targetCrateElement)) {
        return { x: 0, y: 0, z: 0 }
      }
      const modelObject = targetCrateElement?.object3D
      const boundingBox = new window.THREE.Box3().setFromObject(modelObject)
      return boundingBox.getCenter(new window.THREE.Vector3())
    }

    const crateCenterCoordinates = getCrateCenterCoordinates()
    selectedTrashElement?.setAttribute(
      'animation',
      `property: position; to: ${crateCenterCoordinates.x} ${crateCenterCoordinates.y - 0.4} ${crateCenterCoordinates.z}; dur: 200; easing: easeInOutQuad;`
    )

    const matchingTrashItem = trashItems.find(
      item => item.name === activeTrashElement?.id.split('-')[1]
    )
    if (selectedMenuItemName === matchingTrashItem?.correctWasteCategory) {
      document
        .querySelector('[data-score-correct]')
        ?.setAttribute(
          'data-score-correct',
          String(
            Number(
              document.querySelector('[data-score-correct]')?.getAttribute('data-score-correct')
            ) + 1
          )
        )
    } else {
      document
        .querySelector('[data-score-wrong]')
        ?.setAttribute(
          'data-score-wrong',
          String(
            Number(document.querySelector('[data-score-wrong]')?.getAttribute('data-score-wrong')) +
              1
          )
        )
    }

    if (
      trashItems.length ===
      Number(document.querySelector('[data-score-correct]')?.getAttribute('data-score-correct')) +
        Number(document.querySelector('[data-score-wrong]')?.getAttribute('data-score-wrong'))
    ) {
      const dialog = document.querySelector('#dialog')
      const dialogContent = document.querySelector('#dialog-content')
      const dialogButton = document.querySelector('#dialog button')
      if (
        !(dialog instanceof HTMLDialogElement) ||
        !(dialogContent instanceof HTMLElement) ||
        !(dialogButton instanceof HTMLButtonElement)
      ) {
        return
      }
      dialog.show()

      dialogContent.innerHTML = `
      <h1>Game Over!</h1>
      <p class="line-height-1.5">You sorted ${document.querySelector('[data-score-correct]')?.getAttribute('data-score-correct')} out of ${trashItems.length} items correctly.</p>
    `

      dialogButton.innerText = 'Play Again'
      dialogButton.onclick = () => window.location.reload()
    }

    setTimeout(() => {
      const resetSelectionEvent = new CustomEvent('reset-selection', {})
      arMenuElement?.dispatchEvent(resetSelectionEvent)
      arMenuElement?.setAttribute('visible', 'false')
    }, 200)

    activeTrashElement?.setAttribute('data-sorted', 'true')
    const activeTrashElements = document.querySelectorAll('[data-trash-active]')
    activeTrashElements.forEach(trashElement => {
      trashElement.removeAttribute('data-trash-active')
    })
  })
}

const init = () => {
  const appElement = document.getElementById('app')

  if (!appElement) {
    return
  }

  const body = document.createElement('div')
  body.innerHTML = htmlContent
  appElement.appendChild(body)

  listeners()
}

init()
