import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import IconButton from "../components/IconButton";
import LeftChevron from "../icons/LeftChevron";
import RightChevron from "../icons/RightChevron";
import ImageGrid from "../components/ImageGrid";

interface CollectionDetailProps {
  id: number
  name: string
  resetSelectedCollection: () => void
}

export default function CollectionDetail({id, name, resetSelectedCollection}: CollectionDetailProps) {
  const [totalResults, setTotalResults] = useState<number | null>(null)
  const [results, setResults] = useState<Array<{ browseUrl: string }>>([])
  const [resultsPage, setResultsPage] = useState(1)

  const isMounted = useRef(false); // Track component mount status
  const apiKey = "82aeb1db06b1ca37512f845476ab3af317d8775b53410b664fb9c4cd6b117b9d"

  // Fetch results with the query param
  async function fetchAssets(id: number, page: number) {
    const apiUrl = `https://turo.tandemvault.com/api/v1/assets?api_key=${apiKey}&page=${page}&collection_id=${id}`

    return await fetch(apiUrl)
      .then((response) => {
        const totalResultsHeader = response.headers.get("Total-Results")
        const totalResults = totalResultsHeader ? parseInt(totalResultsHeader) : null
        setTotalResults(totalResults)
        console.log(totalResults)

        return response.json()
          .then(results => {
            console.log(results)
            return results.map((result: { browse_url: string; }) => {
              return {
                browseUrl: result.browse_url
              }
            })
          })
      })
  }

  useEffect(() => {
    if (isMounted.current) {
      // Fetch collections only when the component updates after mount
      fetchAssets(id, resultsPage).then((fetchedResults) => {
        setResults(fetchedResults);
      });
    } else {
      // Set component mount status to true to allow subsequent fetches
      isMounted.current = true;
    }
  }, [resultsPage]); // Run effect whenever resultsPage changes

  // Update results when the component is remounted
  useEffect(() => {
    if (isMounted.current) {
      // Fetch collections when the component remounts
      fetchAssets(id, resultsPage).then((fetchedResults) => {
        setResults(fetchedResults);
      });
    }
  }, []); // Empty dependency array to trigger effect only on remount

  function nextPage() {
    let newPage = resultsPage + 1;
    setResultsPage(newPage)
    fetchAssets(id, newPage).then((results) => {
      setResults(results);
    })
  }

  function prevPage() {
    if (resultsPage > 1) {
      let newPage = resultsPage - 1;
      setResultsPage(newPage);
      fetchAssets(id, newPage).then((results) => {
        setResults(results);
      })
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
      <div class="pl-3 pr-4 pt-4 flex justify-between">
        <button onClick={resetSelectedCollection}>
          <div class="flex gap-1 items-center hover:opacity-80 hover:cursor-pointer">
            <LeftChevron/>
            <p class="text-sm font-medium">Back</p>
          </div>
        </button>

        {totalResults !== null && (
          <p id="resultsHeader" class="text-sm text-02 text-right">{totalResults} assets</p>
        )}
      </div>

      <div class="px-4 pt-3">
        <h3 class="text-sm">{name}</h3>
      </div>

      <ImageGrid results={results} placeholder="Loading..."/>

      {/* Show button only if there are results */}
      { totalResults !== null && totalResults > 50 &&
        <div class="flex items-center justify-between px-4 pb-4">
          {prevButton}
          <p class="text-sm">{resultsPage}</p>
          {nextButton}
        </div>
      }
    </div>
  )
}
