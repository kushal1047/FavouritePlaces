import { useState } from "react";
import Places from "./Places.jsx";
import { useEffect } from "react";
import Error from "./Error";
import {sortPlacesByDistance} from "../loc.js";
import {FetchAvailablePlaces} from "../http.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();
  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      try {
        const places = await FetchAvailablePlaces();
        navigator.geolocation.getCurrentPosition((position)=>{
          const sortedPlaces = sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude)
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        })
      } catch (error) {
        setError({
          message: error.message || "Cant fetch places, please try again later",
        });
        setIsFetching(false);
      }

    }
    fetchPlaces();
  }, []);
  if (error) {
    return <Error title="An error occured..." message={error.message} />;
  } else {
    return (
      <Places
        title="Available Places"
        places={availablePlaces}
        isLoading={isFetching}
        loadingText="Fetching Data...."
        fallbackText="No places available."
        onSelectPlace={onSelectPlace}
      />
    );
  }
}
