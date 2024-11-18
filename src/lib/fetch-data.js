export const fetchFixtures = async () => {
    const options = {
      method: "GET",
      headers: {
        'x-rapidapi-key': '1a670cae8fmsh4aec3caa1c0c3c2p1c03c9jsn3379edea8e6a',
        'x-rapidapi-host': 'sportapi7.p.rapidapi.com'
      }
    };
  
    const result = await fetch(
      "https://sportapi7.p.rapidapi.com/api/v1/sport/football/events/live",
      options
    )
      .then((response) => response.json())
      .then((response) => {
        return response;
      })
      .catch((err) => console.error(err));
  
    return result;
  };