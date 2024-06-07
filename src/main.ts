import { on, showUI } from '@create-figma-plugin/utilities'
import { ResizeWindowHandler } from './types'

export default async function () {
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

  // Save access token to client storage when we receive it
  figma.ui.onmessage = async (message) => {
    if (message.message === 'SAVE_ACCESS_TOKEN') {
      await figma.clientStorage.setAsync(
        'ACCESS_TOKEN',
        message.accessToken
      );
    }
  };

  // Get the existing access token if we already have it
  const accessToken = await figma.clientStorage.getAsync('ACCESS_TOKEN');

  figma.ui.postMessage({
    message: 'GET_EXISTING_ACCESS_TOKEN',
    accessToken: accessToken || null,
    // add origin
  });

  // Inform the UI with the same message when we receive a new token
  figma.ui.onmessage = async (message) => {
    if (message.message === 'SAVE_ACCESS_TOKEN') {
      await figma.clientStorage.setAsync(
        'ACCESS_TOKEN',
        message.accessToken
      );
  
      figma.ui.postMessage({
        message: 'GET_EXISTING_ACCESS_TOKEN',
        accessToken: message.accessToken,
        // add origin
      });
    }
  };

  // showUI({
  //   height: 640,
  //   width: 440
  // })
}
