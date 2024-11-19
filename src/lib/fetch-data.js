export const fetchFixtures = async () => {
    const options = {
      method: "GET",
      headers: {
        // 'x-rapidapi-key': '1a670cae8fmsh4aec3caa1c0c3c2p1c03c9jsn3379edea8e6a',
        // 'x-rapidapi-key': 'fc101756ecmsh27b4f751a349a75p13ff75jsn0bd58c4b0d52',
        'x-rapidapi-key': 'cb77a2275amsh67211e0194f3276p1e834ejsn68572125ef0d',
        'x-rapidapi-host': 'sportapi7.p.rapidapi.com'
      }
    };
  
    const result = await fetch(
      "https://sportapi7.p.rapidapi.com/api/v1/sport/football/events/live",
      // "https://sportapi7.p.rapidapi.com/api/v1/odds/%7Bid%7D/featured-events/%7Bsport%7D",
      options
    )
      .then((response) => response.json())
      .then((response) => {
        return response;
      })
      .catch((err) => console.error(err));
  
    return result;
  };