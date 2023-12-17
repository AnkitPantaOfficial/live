import React, { useState, useEffect } from "react";
import './aletfragger.css';


const TopPlayer = () => {
  const [TopPlayers, setTopPlayers] = useState([]);
    const [Fulldata1, setFulldata1] = useState([]);
    const [Photo, setPhoto] = useState([]);
    const [Rest, setRest] = useState([]);
  const [First, setFirst] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [teamData, setTeamData] = useState([]);  // Fix: Add setTeamData
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [secondaryColor, setSecondaryColor] = useState('#000000');
  
  


    useEffect(() => {
        const Data = localStorage.getItem('OTopfraggers');

        if (Data) {
            setTopPlayers(JSON.parse(Data));
        }
    }, []);
    
  
  
    useEffect(() => {
        // Function to fetch and process Excel data
        const fetchData = () => {
            // Fetch MVPMatch data
            fetch('https://script.googleusercontent.com/macros/echo?user_content_key=5WmLXOdoVn2QCzvZu6LE3X2mUEZOxTR28RGu6YIe4ds_Vhg2TJf5y5x6jsJXuiGPE7sbaqjPoeSKTpTwWTs40nytIB-MoteTm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnICjXwtQXdFxLw66LwBYoiFq1YM7G3MDfeLYH3fStepPJzOchzpHLJxN2Nz7z6pRgkwBjP-jB0HZZoHoNPOMN4D3pUVRQ58Fgw&lib=MyDIGNa8ClhITOhHWOHKG6aIwSiYkmlJD')
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
        fetch('https://script.google.com/macros/s/AKfycbyZSdI3NyI_AiPlRIMDi9AdmukDSfVcnANvANCI_v1T2fzbCEUqKMV-uQwAt_a7S3G-/exec') // Replace with your actual Google Apps Script URL
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

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbz5MaS11pgUeKkrXBXricCRDD71zmPapnT0yeeq75mcTpW7ivy_sVGSK9uf9fajK79T/exec');
        const data = await response.json();

        const primaryColorItem = data.data.find(item => item.MATCH === 'Primary Color');
        const secondaryColorItem = data.data.find(item => item.MATCH === 'Secondary Color');

        if (primaryColorItem) {
          setPrimaryColor(primaryColorItem.MAP);
        }

        if (secondaryColorItem) {
          setSecondaryColor(secondaryColorItem.MAP);
        }
      } catch (error) {
        console.error('Error fetching data from API:', error);
      }
    };

    fetchDataFromApi();
  }, []);



    return (
      <div className="fraggerframe">
        <button onClick={toggleSidebar}>TopPlayers</button>
        <div className={`fraggerframe ${isSidebarVisible ? '' : 'sidebar-hidden'}`}>
        <div className="FRAGER">
          <div className="fraggeroverlap-group">
            {TopPlayers.map((player, index) => (
              <div className="sidebar">
                <div key={index} className="fraggerrectangle-2 "style={{ backgroundColor: primaryColor }}>
                  <div className="fraggerkill">KILLS</div>
                  <div className="fraggerkill-point">{player.Kills}</div>
                  <img className="TopPlayerTeamLogo" src= {player.TeamLogo} alt="Team Logo" />
                </div>
                  <img className="fraggerplayer-photo" src={getPlayerPhotoUrl(player.PlayerName)}alt="Player" />
                <div className="fraggerrectangle">
                    <div className="fraggerposition">#{index + 1}</div>
                    <div className="fraggerplayer-name">{player.PlayerName}</div>
                  </div>
              </div>
            ))}
                    <div className="fragger">
                    <div className="frager-box"></div>
                    <div className="top-fragger">TOP FRAGGER</div>
                </div>
          </div>
        </div>
        </div>   
      </div>

      
    );
  };
export default TopPlayer;
