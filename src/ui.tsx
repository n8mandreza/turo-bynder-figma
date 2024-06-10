// npm run watch to watch for code changes
import { render, useWindowResize } from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { ResizeWindowHandler } from './types'
import { h } from 'preact'
import '!./output.css'

function Plugin () {
  function onWindowResize(windowSize: { width: number; height: number }) {
    emit<ResizeWindowHandler>('RESIZE_WINDOW', windowSize)
  }
  useWindowResize(onWindowResize, {
    maxHeight: 800,
    maxWidth: 600,
    minHeight: 640,
    minWidth: 440,
    resizeBehaviorOnDoubleClick: 'minimize'
  })

  return (
    <div class="flex flex-col h-full gap-6 items-center justify-center">
      <h1 class="text-3xl font-bold">
        Turo Bynder
      </h1>
    </div>
  )
}

export default render(Plugin)
