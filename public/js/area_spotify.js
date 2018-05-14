// // BQDrr8DFQiWyeTjRXGfo0bq-7nL3HDl9-zaaQ8l0ek7NGxFq6pRWeGy5Ui1FYJNhmMqFQA7A2kxSgZg6dj5lFVL3PPmY4v2lq3s2BmWoywy8WTin9YRSaNl9-KenqLVdpFyeUES5gG3KELKHafn9XpSWLp9YLwa3Ng

// window.onSpotifyWebPlaybackSDKReady = () => 
// {
//   const token = 'BQDrr8DFQiWyeTjRXGfo0bq-7nL3HDl9-zaaQ8l0ek7NGxFq6pRWeGy5Ui1FYJNhmMqFQA7A2kxSgZg6dj5lFVL3PPmY4v2lq3s2BmWoywy8WTin9YRSaNl9-KenqLVdpFyeUES5gG3KELKHafn9XpSWLp9YLwa3Ng';
//   const player = new Spotify.Player({
//     name: 'Web Playback SDK Quick Start Player',
//     getOAuthToken: cb => { cb(token); }
//   });

//   // Error handling
//   player.addListener('initialization_error', ({ message }) => { console.error(message); });
//   player.addListener('authentication_error', ({ message }) => { console.error(message); });
//   player.addListener('account_error', ({ message }) => { console.error(message); });
//   player.addListener('playback_error', ({ message }) => { console.error(message); });

//   // Playback status updates
//   player.addListener('player_state_changed', state => { console.log(state); });

//   // Ready
//   player.addListener('ready', ({ device_id }) => {
//     console.log('Ready with Device ID', device_id);
//   });

//   // Not Ready
//   player.addListener('not_ready', ({ device_id }) => {
//     console.log('Device ID has gone offline', device_id);
//   });

//   // Connect to the player!
//   player.connect();

// const spotify_uri = "3P9wnEqkJUN18SUahy5kp8";

// const play = ({
//   spotify_uri,
//   playerInstance: {
//     _options: {
//       getOAuthToken,
//       id
//     }
//   }
// }) => {
//   getOAuthToken(token => {
//     fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
//       method: 'PUT',
//       body: JSON.stringify({ uris: [spotify_uri] }),
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//     });
//   });
// };

// player.nextTrack().then(() => {
//   console.log('Skipped to next track!');
// });

// };