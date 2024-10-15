import { useEffect } from 'react'

export const Map = () => {
  useEffect(() => {
    const getMajorRoads = async (city: string, apiKey: string): Promise<void> => {
      const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json'
      const params = new URLSearchParams({
        query: `major roads in ${city}`,
        key: apiKey,
      })

      //

      try {
        const response = await fetch(`${url}?${params.toString()}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        const roads = data.results

        roads.forEach((road: { name: string }) => {
          console.log(road.name)
        })
      } catch (error) {
        console.error('Error fetching data from Google Places API:', error)
      }
    }

    const city = 'St. Louis, MO'
    const apiKey = 'API KEY GOES HERE.  READ FROM ENV'

    getMajorRoads(city, apiKey)
  })
  return <div>Hi</div>
}
