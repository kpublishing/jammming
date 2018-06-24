
let accessToken;

const redirectUri='http://localhost:3000/';
const clientId='88f7d824f5f5484f9f37e9210cea47b5';


const Spotify = {
    getAccessToken() {
      if (accessToken) {
        return accessToken;
      }
  
      const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
      const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
      if (accessTokenMatch && expiresInMatch) {
        accessToken = accessTokenMatch[1];
        const expiresIn = Number(expiresInMatch[1]);
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/'); // This clears the parameters, allowing us to grab a new access token when it expires.
        return accessToken;
      } else {
        const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
        window.location = accessUrl;
      }
    },

    search(searchTerm) {
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, 
        { headers: {Authorization: `Bearer ${accessToken}`} }
        ).then(response => {return response.json();}
        ).then(jsonResponse => {
            // console.log(jsonResponse);
            if (jsonResponse.tracks) {
                return jsonResponse.tracks.items.map(
                    track => {
                        return{
                            id: track.id,
                            name: track.name,
                            artist: track.artists[0].name,
                            album: track.album.name,
                            URI: track.uri
                        }
                    }
                )
            }
        }
        )

    },

    savePlaylist(nameOfPlaylist, trackURIs){

        if (!nameOfPlaylist || !trackURIs)
           return;
        // let token = accessToken;
        let authHeader = {Authorization: `Bearer ${accessToken}`};
        let userID;
        // console.log('URIs: ', trackURIs);

        return fetch(`https://api.spotify.com/v1/me`, {headers: authHeader}
        ).then(response => {return response.json();}
        ).then(jsonResponse => {
            userID = jsonResponse.id;
            // console.log('Me: ', jsonResponse.id);
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,
            {headers:   {Authorization: `Bearer ${accessToken}`,
                         'content-type': 'application/json'   },
             method:    'post',
             body:  JSON.stringify({name: nameOfPlaylist})    
            }
            ).then(response => {return response.json();}
            ).then(jsonResponse => {
            // console.log(jsonResponse);
            let playlistID = jsonResponse.id;
            fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`,
            {headers:   {Authorization: `Bearer ${accessToken}`,
                         'content-type': 'application/json'   },
             method:    'post',
             body:  JSON.stringify({uris: trackURIs})    
            }

            )
            })

        })
        

    }
}
  

export default Spotify;