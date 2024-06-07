import { h } from "preact";
import IconButton from "../components/IconButton";
import LeftChevron from "../icons/LeftChevron";
import RightChevron from "../icons/RightChevron";

interface CollectionsListProps {
  results: { id: number; name: string; assetsCount: number, thumbUrl: string }[];
  getCollectionDetails: (id: number, name: string, assetsCount: number) => void;
  totalResults: number | null;
  setResultsPage: (pageNumber: number) => void;
  resultsPage: number;
  fetchCollections: (page: number) => Promise<any>;
}

export default function CollectionsList({
  results,
  getCollectionDetails,
  totalResults,
  setResultsPage,
  resultsPage,
  fetchCollections,
}: CollectionsListProps) {

  async function nextPage(){
    let newPage = resultsPage + 1;
    setResultsPage(newPage)
    await fetchCollections(newPage)
  }

  async function prevPage(){
    if (resultsPage > 1) {
      let newPage = resultsPage - 1;
      setResultsPage(newPage);
      await fetchCollections(newPage)
    }
  }

  let prevButton, nextButton;

  if (totalResults && totalResults > 50 && resultsPage === 1) {
    prevButton = <IconButton onClick={prevPage} disabled={true}><LeftChevron/></IconButton>
  } else {
    prevButton = <IconButton onClick={prevPage}><LeftChevron/></IconButton>
  }

  if (!(totalResults && (totalResults / 50) > resultsPage)) {
    nextButton = <IconButton onClick={nextPage} disabled={true}><RightChevron/></IconButton>
  } else {
    nextButton = <IconButton onClick={nextPage}><RightChevron/></IconButton>
  }

  return (
    <div class="flex flex-col">
      {totalResults !== null && (
        <p id="resultsHeader" class="px-4 pt-4 text-sm text-02 text-right">{totalResults} collections</p>
      )}

      <div id="collectionsList" class="p-4 flex flex-col gap-4">
        {results.length > 0 ? (
          results.map((result) => (
            <div onClick={() => getCollectionDetails(result.id, result.name, result.assetsCount)} class="flex gap-3 items-center cursor-pointer hover:opacity-80">
              <img src={result.thumbUrl} class="cursor-pointer w-10 h-10 object-cover object-center rounded-md"/>
              <div class="cursor-pointer flex flex-col">
                <p class="text-sm">{result.name}</p>
                <p class="text-xs text-02">{result.assetsCount} assets</p>
              </div>
            </div>
          ))
        ) : (
          <span class="text-sm text-02 col-span-2">Loading...</span>
        )}
      </div>

     {/* Show button only if there are results */}
     {totalResults && totalResults > 50 &&
        <div class="flex items-center justify-between px-4 pb-4">
          {prevButton}
          <p class="text-sm">{resultsPage}</p>
          {nextButton}
        </div>
      }
    </div>
  )
}