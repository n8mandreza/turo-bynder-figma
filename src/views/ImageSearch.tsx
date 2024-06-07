import { JSX, h } from "preact";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { useState } from "preact/hooks";
import IconButton from "../components/IconButton";
import LeftChevron from "../icons/LeftChevron";
import RightChevron from "../icons/RightChevron";
import ImageGrid from "../components/ImageGrid";

export default function ImageSearch() {
  const [query, setQuery] = useState<string>('')
  const [totalResults, setTotalResults] = useState<number | null>(null)
  const [results, setResults] = useState<Array<{ browseUrl: string }>>([])
  const [resultsPage, setResultsPage] = useState(1)

  // setQuery as user types
  function handleInputChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    event.preventDefault(); // Prevent default action
    setQuery(event.currentTarget.value);
  }

  // Fetch results with the query param
  async function fetchAssets(query: string, page: number) {
    const apiKey = "82aeb1db06b1ca37512f845476ab3af317d8775b53410b664fb9c4cd6b117b9d"
    const apiUrl = `https://turo.tandemvault.com/api/v1/assets?page=${page}&api_key=${apiKey}&q=${query}`

    return await fetch(apiUrl)
      .then((response) => {
        const totalResultsHeader = response.headers.get("Total-Results")
        const totalResults = totalResultsHeader ? parseInt(totalResultsHeader) : null
        setTotalResults(totalResults)

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

  // Trigger search with the given query
  function handleSearch(event: JSX.TargetedEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent default action (form submission)
    // Reset resultsPage to 1 for new queries
    let newPage = 1;
    setResultsPage(newPage)
    fetchAssets(query, newPage)
      .then(results => {
        setResults(results)
      })
  }

  function nextPage() {
    let newPage = resultsPage + 1;
    setResultsPage(newPage)
    fetchAssets(query, newPage).then((results) => {
      setResults(results);
    })
  }

  function prevPage() {
    if (resultsPage > 1) {
      let newPage = resultsPage - 1;
      setResultsPage(newPage);
      fetchAssets(query, newPage).then((results) => {
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
      <form class="flex gap-3 px-4 py-3 border-b stroke-01" onSubmit={handleSearch}>
        <TextInput id="query" label="Search" showLabel={false} placeholder="Search" onInput={handleInputChange}/>

        <Button label="Search" size="compact" isFormSubmit={true}/>
      </form>

      {totalResults !== null && (
        <p id="resultsHeader" class="px-4 pt-4 text-sm text-02 text-right">{totalResults} results</p>
      )}

      <ImageGrid results={results} placeholder="Try searching something"/>

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
