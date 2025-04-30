import 'spatial-design-system/primitives/ar-menu.js'
import 'spatial-design-system/components/position.js'
import 'aframe-environment-component'
import { trashItems, wasteBinConfiguration, wasteBinLabelConfiguration } from './constants'

export const htmlContent = `
<dialog id="dialog">
  <div class="dialog-overlay"></div>
  <div class="dialog-container">
    <div class="dialog-content">
      <div class="dialog-text" id="dialog-content">
        <h1>Welcome to TrashIt!</h1>
        <p class="line-height-1-5">In this game, you will be presented with various items of trash. <br />Each item has a specific waste type it belongs to. <br />There are four waste types: Paper, Plastic, Glass, and General. <br />To win the game, you need to sort the trash into the correct waste bins. <br />To do this, you will need to pick up the trash and place it in the correct bin. <br />Once you have sorted all the trash, you will be able to see your score. <br /><br /><b>Good luck!</b></p>
      </div>
      <form method="dialog" class="dialog-form">
        <button data-testid="dialog-button" class="dialog-button" type="submit">Play!</button>
      </form>
    </div>
  </div>
</dialog>

<div id="score">
  <h2 class="score-header">Score</h2>
  <p data-testid="score-correct" data-score-correct="0">Correct: </p>
  <p data-score-wrong="0">Wrong: </p>
  <button onclick="window.location.reload()">Restart</button>
</div>

<a-scene id="scene" xr-mode-ui="enabled: false">
  <a-assets>
    <a-asset-item id="crate-model" src="/crate.glb"></a-asset-item>

    ${trashItems.map(item => `<a-asset-item id="trash-model-${item.name}" src="/${item.name}.glb"></a-asset-item>`).join('\n')}
  </a-assets>

  ${trashItems
    .map(
      item => `
    <a-entity gltf-model="#trash-model-${item.name}"
      id="trash-${item.name}"
      scale="${item.size}"
      position="${item.position.x} ${item.position.y} ${item.position.z}"
      rotation="${item.rotation.x} ${item.rotation.y} ${item.rotation.z}"
      data-sorted="false"
    ></a-entity>`
    )
    .join('\n')}

  ${wasteBinLabelConfiguration.supportedCategories
    .map(
      (item, index) => `
    <a-entity
      position="${wasteBinLabelConfiguration.position.x + wasteBinLabelConfiguration.stepDistance * index} ${wasteBinLabelConfiguration.position.y} ${wasteBinLabelConfiguration.position.z}"
      scale="${wasteBinLabelConfiguration.dimensions}"
      text="value: ${item.toUpperCase()};"
    ></a-entity>`
    )
    .join('\n')}

  ${wasteBinConfiguration.supportedCategories
    .map(
      (item, index) => `
    <a-entity gltf-model="#crate-model"
      id="crate-${item}"
      position="${wasteBinConfiguration.position.x + wasteBinConfiguration.stepDistance * index} ${wasteBinConfiguration.position.y} ${wasteBinConfiguration.position.z}"
      scale="${wasteBinConfiguration.dimensions}"
      rotation="${wasteBinConfiguration.rotation}"
    ></a-entity>`
    )
    .join('\n')}

  <a-ar-menu
    position="0 1.5 -3"
    visible="false"
    primary="#8bc34a"
    id="arMenu"
    highlighted="#4caf50"
    variant="filled"
    layout="circle"
    items="[
      {'color':'#00bcd4','icon':'/paper','title':'Paper','textColor':'#fff'},
      {'color':'#9e9e9e','icon':'/general','title':'General','textColor':'#fff'},
      {'color':'#04a90a','icon':'/glass','title':'Glass','textColor':'#fff'},
      {'color':'#ffeb3b','icon':'/plastic','title':'Plastic','textColor':'#fff'}
    ]"
  ></a-ar-menu>

  <a-entity
    position="0 0 5.8"
    scale="0.1 0.01 10"
    geometry="primitive: box"
    rotation="0 90 0"
    material="color: #6bc800; opacity: 0.5"
    id="start-line"
  ></a-entity>


  <a-entity id="environment" environment="preset: forest; fog: 0; seed: ${Math.random()}"></a-entity>

  <a-camera position="0 1.7 8" look-controls wasd-controls>
    <a-cursor></a-cursor>
  </a-camera>
</a-scene>
`
