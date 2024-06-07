import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import CollectionDetail from "./CollectionDetail";
import CollectionsList from "./CollectionsList";

export default function Collections() {
  const [totalResults, setTotalResults] = useState<number | null>(null)
  const [results, setResults] = useState<Array<{ name: string, id: number, assetsCount: number, thumbUrl: string }>>([])
  const [resultsPage, setResultsPage] = useState(1)
  const [selectedCollection, setSelectedCollection] = useState<{
    id: number;
    name: string;
    assetsCount: number;
  } | null>(null);
  const isMounted = useRef(false); // Track component mount status
  const apiKey = "82aeb1db06b1ca37512f845476ab3af317d8775b53410b664fb9c4cd6b117b9d"

  // Fetch collections
  async function fetchCollections(page: number) {
    const apiUrl = `https://turo.tandemvault.com/api/v1/collections?page=${page}&api_key=${apiKey}`

    return await fetch(apiUrl)
      .then((response) => {
        const totalResultsHeader = response.headers.get("Total-Results")
        const totalResults = totalResultsHeader ? parseInt(totalResultsHeader) : null
        setTotalResults(totalResults)
        console.log(totalResults)

        return response.json()
          .then(results => {
            console.log(results)
            return results.map((result: { name: string, id: number, assets_count: number, thumb_url: string }) => {
              return {
                name: result.name,
                id: result.id,
                assetsCount: result.assets_count,
                thumbUrl: result.thumb_url
              }
            })
          })
      })
  }

  function getCollectionDetails(id: number, name: string, assetsCount: number) {
    setSelectedCollection({ id, name, assetsCount });
  }

  function resetSelectedCollection() {
    setSelectedCollection(null);
  }

  useEffect(() => {
    if (isMounted.current) {
      // Fetch collections only when the component updates after mount
      fetchCollections(resultsPage).then((fetchedResults) => {
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
      fetchCollections(resultsPage).then((fetchedResults) => {
        setResults(fetchedResults);
      });
    }
  }, []); // Empty dependency array to trigger effect only on remount

  let currentView;

  if (selectedCollection) {
    currentView = (
      <CollectionDetail
        id={selectedCollection.id}
        name={selectedCollection.name}
        resetSelectedCollection={resetSelectedCollection}
      />
    );
  } else {
    currentView = (
      <CollectionsList
        results={results}
        getCollectionDetails={getCollectionDetails}
        totalResults={totalResults}
        setResultsPage={setResultsPage}
        resultsPage={resultsPage}
        fetchCollections={fetchCollections}
      />
    )
  }

  return (
    <div>
      {currentView}
    </div>
  )
}
