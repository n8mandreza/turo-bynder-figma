import { emit } from "@create-figma-plugin/utilities";
import { h } from "preact";

interface ImageGridProps {
  results: {browseUrl: string}[]
  placeholder: string
}

export default function ImageGrid({results, placeholder}: ImageGridProps) {
  function getImgData(browseUrl: any) {
    let imgurl = `https://fathomless-harbor-11420.herokuapp.com/${browseUrl}`
    fetch(imgurl)
      .then(r => r.arrayBuffer())
        .then(a =>
          emit('IMG-DATA', new Uint8Array(a))
        )
  }

  return (
    <div id="resultsGrid" class="p-4 grid grid-cols-2 gap-4">
      {results.length > 0 ? (
        results.map((result) => (
          <div class="single-result">
            <img
              src={result.browseUrl}
              onClick={() => getImgData(result.browseUrl)}
              class="cursor-pointer hover:opacity-90"
            />
          </div>
        ))
      ) : (
        <span class="text-sm text-02 col-span-2">{placeholder}</span>
      )}
    </div>
  )
}
