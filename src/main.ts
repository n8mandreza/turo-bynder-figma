// Use npm run watch to watch for code changes

import { on, showUI } from '@create-figma-plugin/utilities'
import { ResizeWindowHandler } from './types'

export default async function () {
  // Function to create new node or updated selected node with image data
  function renderImage(imgData: Uint8Array) {
    let imageHash = figma.createImage(new Uint8Array(imgData)).hash

    if (figma.currentPage.selection.length > 0) {
      for (const node of figma.currentPage.selection) {
        if ("fills" in node) {
          node.fills = [
            { type: "IMAGE", scaleMode: "FILL", imageHash },
          ]
        }
      }
    } else {
      const nodes: Array<SceneNode> = []
      const rect = figma.createRectangle()
      rect.x = figma.viewport.center.x
      rect.y = figma.viewport.center.y
      rect.resize(400, 400)
      rect.fills = [
        { type: "IMAGE", scaleMode: "FILL", imageHash },
      ]
      figma.currentPage.appendChild(rect)
      nodes.push(rect)
      figma.currentPage.selection = nodes
      figma.viewport.scrollAndZoomIntoView(nodes)
    }
  }

  // Window resize handler (doesn't work because UI is hosted elsewhere)
  on<ResizeWindowHandler>(
    'RESIZE_WINDOW',
    function (windowSize: { width: number; height: number }) {
      const { width, height } = windowSize
      figma.ui.resize(width, height)
    }
  )

  // Show hosted UI
  figma.showUI(
    `<script>window.location.href = "https://turo-bynder-assets.vercel.app"</script>`,
    {height: 640, width: 440}
  )


  figma.ui.onmessage = async (message) => {
    console.log("Received message from UI:", message)

    switch (message.message) {
      case 'SAVE_ACCESS_TOKEN':
        // Save access token to client storage when we receive it
        await figma.clientStorage.setAsync(
          'ACCESS_TOKEN',
          message.accessToken
        );

        // Inform the UI with the same message when we receive a new token
        figma.ui.postMessage({
          message: 'GET_EXISTING_ACCESS_TOKEN',
          accessToken: message.accessToken
        }, {
          origin: "https://turo-bynder-assets.vercel.app"
        });
        break;
      
      case 'IMG_DATA':
        renderImage(message.imgData)
        break;
      
      default:
        console.log("Unhandled message type:", message.message)
    }
  };

  // Get the existing access token if we already have it
  const accessToken = await figma.clientStorage.getAsync('ACCESS_TOKEN');
  console.log("Existing access token in clientStorage:", accessToken)

  setTimeout(() => {
    figma.ui.postMessage({
      message: 'GET_EXISTING_ACCESS_TOKEN',
      accessToken: accessToken || null
    }, {
      origin: "https://turo-bynder-assets.vercel.app"
    });
  }, 2000)
}
