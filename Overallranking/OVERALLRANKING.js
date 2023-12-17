import React, { useState, useEffect } from "react";
import './overallstats.css';

const OverallRanking = () => {
  const [TopPlayers, setTopPlayers] = useState([]);
    const [Fulldata1, setFulldata1] = useState([]);
    const [Photo, setPhoto] = useState([]);
    const [Rest, setRest] = useState([]);
  const [First, setFirst] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [teamData, setTeamData] = useState([]);  // Fix: Add setTeamData
  


    
    useEffect(() => {
      // Fetch data from the Google Apps Script endpoint
      fetch('https://script.googleusercontent.com/macros/echo?user_content_key=5WmLXOdoVn2QCzvZu6LE3X2mUEZOxTR28RGu6YIe4ds_Vhg2TJf5y5x6jsJXuiGPE7sbaqjPoeSKTpTwWTs40nytIB-MoteTm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnICjXwtQXdFxLw66LwBYoiFq1YM7G3MDfeLYH3fStepPJzOchzpHLJxN2Nz7z6pRgkwBjP-jB0HZZoHoNPOMN4D3pUVRQ58Fgw&lib=MyDIGNa8ClhITOhHWOHKG6aIwSiYkmlJD')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          const dataArray = Array.from(data.data);
  
          const processData = (data) => {
            const teamsMap = new Map();
  
            // Iterate through the data and group players by team name
            data.forEach((item) => {
              const teamName = item["TeamName"];
              if (!teamsMap.has(teamName)) {
                teamsMap.set(teamName, {
                  "TeamName": teamName,
                  "TeamLogo": item["TeamLogo"],
                  "TeamFlag": item["TeamFlag"],
                  "TeamKills": item["TeamKills"],
                  "TeamPosition": item["TeamPosition"],
                  "TotalPoints": item["TotalPoint"],
                  "WWCD": item["Chicken"],
                  Players: [],
                });
              }
  
              teamsMap.get(teamName).Players.push({
                "PlayerName": item["PlayerName"],
                "Kills": item["Kills"],
                "Contribution": item["Contribution"]
              });
            });
  
            // Convert the Map to an array of teams
            const teams = Array.from(teamsMap.values());
  
            // Create the final object structure
            const formattedData = {
              "Teams": teams,
            };
  
            return formattedData;
          };
  
          // Process and format the data
          const formattedData = processData(dataArray);
          console.log(formattedData);
          formattedData.Teams.sort((a, b) => {
            if (a.TotalPoints !== b.TotalPoints) {
              return b.TotalPoints - a.TotalPoints;
            } else {
              // If TotalPoints are the same, continue sorting by TeamPosition
              if (a.WWCD !== b.WWCD) {
                return b.WWCD - a.WWCD; // Sort by TeamPosition in ascending order
              } else {
              // If TotalPoints are the same, continue sorting by TeamPosition
              if (a.TeamPosition !== b.TeamPosition) {
                return b.TeamPosition - a.TeamPosition; // Sort by TeamPosition in ascending order
              } else {
                // If TeamPosition is the same, continue sorting by Kills
                if (a.TeamKills !== b.TeamKills) {
                  return b.TeamKills - a.TeamKills; // Sort by TeamKills in descending order
                } else {
                  // If all criteria are the same, sort by the order of appearance
                  const earliestA = teamData.findIndex((team) => team.TeamName === a.TeamName);
                  const earliestB = teamData.findIndex((team) => team.TeamName === b.TeamName);
                  return earliestA - earliestB; // Sort by the order of appearance
                }
              }
            }
            }
          });
  
          let FirstTeam = formattedData.Teams[0]; // Change index to 0 for the first team
          let RestTeam = formattedData.Teams.slice(1, 25);
  
          console.log(FirstTeam, 'first');
          console.log(RestTeam, 'rest');
          setFirst(FirstTeam);
          setRest(RestTeam);
          localStorage.setItem('tFMS', JSON.stringify(FirstTeam));
          localStorage.setItem('tRMS', JSON.stringify(RestTeam));
  
          // Fix: Set the teamData state
          setTeamData(formattedData.Teams);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }, []);
  
    
  
    useEffect(() => {
      fetch('/api/fulldata1')
        .then(response => response.json())
        .then(data => setFulldata1(data))
        .catch(error => console.error('Error fetching data:', error));
    }, []);
  
    useEffect(() => {
      fetch('/api/teamData')
        .then(response => response.json())
        .then(data => setTeamData(data))  // Fix: Set the teamData state
        .catch(error => console.error('Error fetching data:', error));
    }, []);
  
    useEffect(() => {
        // Function to fetch and process Excel data
        const fetchData = () => {
            // Fetch MVPMatch data
            fetch('https://script.google.com/macros/s/AKfycbxUQKaF7RoyYCfXip-o7XJeur5BaJWvJRQxuPjAcb97T94KRDnSHP3g8OkC0Qug5YlD/exec')
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Could not fetch MVPMatch data");
                    }
                    return response.json();
                })
                .then(data => {
                  
                    console.log(data.data);
                               const player = data.data;
                                localStorage.setItem('player2', JSON.stringify(player));
                                data.data.shift();
                                // Sort the players by kills and team kills
                                const sortedPlayers = data.data.sort((a, b) => {
                                    if (a["Kills"] > b["Kills"]) {
                                        return -1;
                                    } else if (a["Kills"] < b["Kills"]) {
                                        return 1;
                                    } else {
                                        // If kills are tied, compare team kills
                                        return b["TeamKills"] - a["TeamKills"];
                                    }
                                });

                                // Get the top 4 players
                                const top4Players = sortedPlayers.slice(0, 4);

                                console.log(top4Players);
                                setTopPlayers(top4Players);
                                localStorage.setItem('OTopfraggers', JSON.stringify(top4Players));
                 

                    }
                )
                .catch((error) => {
                    console.error("Error fetching MVPMatch data:", error);
                });
        };

        fetchData();

        const intervalIdMVPMatch = setInterval(fetchData, 2000);

        // Clean up the interval when the component unmounts
        return () => {
            clearInterval(intervalIdMVPMatch);
        };
    }, []);
    useEffect(() => {
        const Data = localStorage.getItem('photoMatchData');

        if (Data) {
            setPhoto(JSON.parse(Data));
        }
    }, []);

    useEffect(() => {
      // Function to fetch player photos
      const fetchPlayerPhotos = () => {
        fetch('https://script.google.com/macros/s/AKfycbzboka7maJiiVOdGDikSQvxIUFYgAl-Kjl04NJZJKEnfeZ_4iOnGXNXA1BzNu_Jjy_qHw/exec') // Replace with your actual Google Apps Script URL
          .then(response => {
            if (!response.ok) {
              throw new Error("Could not fetch player photos");
            }
            return response.json();
          })
          .then(data => {
            console.log(data.data);
            setPhoto(data.data);
          })
          .catch((error) => {
            console.error("Error fetching player photos:", error);
          });
      };
  
      // Call the function to fetch player photos
      fetchPlayerPhotos();
  
      // Optional: Set up an interval to periodically fetch player photos
      const intervalId = setInterval(fetchPlayerPhotos, 2000);
  
      // Clean up the interval when the component unmounts
      return () => clearInterval(intervalId);
    }, []); // Empty dependency array to run the effect only once

    const getPlayerPhotoUrl = (playerName) => {
    const player = Photo.find((p) => p.Name === playerName);
    const defaultImageUrl = 'https://media.discordapp.net/attachments/1043905461193285702/1177634952439930971/black.png?ex=65733904&is=6560c404&hm=ce8e11d29ac48de2a7cf75484719eeaccd45b62fe807645437c732d9235580a7&=&format=webp&width=671&height=671';
    return player && player.Photo ? player.Photo : defaultImageUrl;
  };
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };
  const [isTopPlayersVisible, setIsTopPlayersVisible] = React.useState(true);
  const [isOverallStatsVisible, setIsOverallStatsVisible] = React.useState(false);

  const showTopPlayers = () => {
    setIsTopPlayersVisible(true);
    setIsOverallStatsVisible(false);
  };

  const showOverallStats = () => {
    setIsTopPlayersVisible(false);
    setIsOverallStatsVisible(true);
  };

  

    return (
      <div className="fraggerframe">
              {/* OVERALL STATS ON MAIN SCREEN */}
          <button onClick={toggleSidebar}>TopPlayers</button>
        <div className="overall-stats">
        <div className={`fraggerframe ${isSidebarVisible ? '' : 'sidebar-hidden'}`}>
          <div className="statsdiv">
            <div className="stats">
            <div className="bottom-part">
            <div className="stats-overlap">
                <img className="img" alt="background" src="https://cdn.discordapp.com/attachments/1180813422594625536/1184839391764549725/background.png?ex=658d6eac&is=657af9ac&hm=5b3e09f5f705081793db1f7331b11d84d9c30eb1d8fba4bc1a6154569a37ba12&"/>
                <div className="stats-text-wrapper-6">OVERALL RANKING</div>
            </div>
             </div>
              <div className="stats-top-box">
                <div className="overlap-group">
                  <img className="background" alt="background" src="https://cdn.discordapp.com/attachments/1180813422594625536/1184839391764549725/background.png?ex=658d6eac&is=657af9ac&hm=5b3e09f5f705081793db1f7331b11d84d9c30eb1d8fba4bc1a6154569a37ba12&"/>
                  <div className="overal-TEAM">TEAM</div>
                </div>
              </div>
              <div className="div-wrapper">
                <div className="text-wrapper-2">TOTAL</div>
              </div>


              <div className="overall-box">
            <div className="overall-stats-box">
            {Rest.slice(0, 20).map((team, index) => (
              <div className="stats-teambox">
                <div className="rank-box">
                  <div className="stats-rank">{index + 1}</div>
                  <div className="stats-name-box">
                    <div className="stats-logo">
                      <img className="stats-logo" alt="logo" src={team.TeamLogo}/>
                    </div>
                    <div className="stats-flag">
                      <img className="stats-Flag" alt="logo" src="https://media.discordapp.net/attachments/1179258727061270650/1184080735892676659/Flag_of_Nepal.svg_1.png?ex=658aac1e&is=6578371e&hm=a52ad979cd2ab31f40b327038481b297e99782a60d250a73a0ebdebacbe9a9cb&=&format=webp&quality=lossless&width=510&height=621"/>
                    </div>
                    <div className="text-wrapper-4">{team.TeamName}</div>
                  </div>
                  <div className="point-box">
                    <div className="text-wrapper-5">{team.TotalPoints}</div>
        </div>
      </div>
              </div>
               ))}
              
          </div>
          </div>
          </div>
            </div>
          </div>    
          </div>    
      </div>

      
    );
  };
export default OverallRanking;
