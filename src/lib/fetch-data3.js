export const fetchFixtures3 = async () => {
  const options = {
    method: "GET",
    headers: {
      // 'x-rapidapi-key': '1a670cae8fmsh4aec3caa1c0c3c2p1c03c9jsn3379edea8e6a',
      // 'x-rapidapi-key': 'fc101756ecmsh27b4f751a349a75p13ff75jsn0bd58c4b0d52',
      // 'x-rapidapi-key': 'cb77a2275amsh67211e0194f3276p1e834ejsn68572125ef0d',
     // 'x-rapidapi-key': 'b6fd1cb83amsh91d6a45657328abp13eec7jsn1b18469f2d63',
      // 'x-rapidapi-key': 'b83399e51bmshb5a29347683b39fp16fa44jsn6ae173e4b95d',
      // 'x-rapidapi-key': 'fdc8ddca28msh75e20876732fe9cp16024ejsnec4f62fd74d6',
      // 'x-rapidapi-key': '7f82c106femsh86395b53d572801p1a530djsndfe41c97529c',
     // 'x-rapidapi-key': '16b138d891msh1e3d501ad7570c5p1a0204jsn3216d2cdde09',
    //  'x-rapidapi-key': '1724c27814msh905855bc100316dp1a0a72jsn160b71156010',
    //  'x-rapidapi-key': '430bc19d3bmsh4254ee9452482e2p1561aajsn68f257e54593',
    //  'x-rapidapi-key': 'e489f99d34msh98ccd87b56a5cccp1e07c2jsn4cadb201c186',
    //  'x-rapidapi-key': '5655817fbcmshd8641d9f4953891p141a2djsn4971c7d09a5a',
    // 'x-rapidapi-key': 'df9569fba5mshe505d8e6e9d0ff3p17e2d3jsn7f95643c1699',
    // 'x-rapidapi-key': '2c4c71b5dbmsh1d98483ec2d7bd8p1918e2jsncc1073e80fe2',
    // 'x-rapidapi-key': 'd0c67733b6mshfa8336a63dd6733p14e95ejsnbbd6af2c8c60',
    // 'x-rapidapi-key': 'c19364805amsh5cb8a303aabfb29p1f6d8ejsn4b6549efea8b',
    'x-rapidapi-key': 'f057948334mshab42a85484757b2p1639f9jsn97e2e3baefd8',
      'x-rapidapi-host': 'sportapi7.p.rapidapi.com'
    }
  };

  const result = await fetch(
    // "https://sportapi7.p.rapidapi.com/api/v1/sport/football/events/live",
    // "https://sportapi7.p.rapidapi.com/api/v1/odds/%7Bid%7D/featured-events/%7Bsport%7D",
    "https://sportapi7.p.rapidapi.com/api/v1/sport/football/scheduled-events/2024-11-26",
    options
  )
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch((err) => console.error(err));

  return result;
};