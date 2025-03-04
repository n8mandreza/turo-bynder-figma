// This file is the default plugin UI entrypoint.
// This file isn't currently in use because figma.showUI in main.ts 
// points to a public URL instead of this file.
import { render, useWindowResize } from '@create-figma-plugin/ui'
import { h } from 'preact'
import '!./output.css'

function Plugin () {
  return (
    <div class="flex flex-col h-full gap-6 items-center justify-center">
      <h1 class="text-3xl font-bold">
        Turo Bynder
      </h1>
    </div>
  )
}

export default render(Plugin)
