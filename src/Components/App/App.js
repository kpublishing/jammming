import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {searchResults: [
     /* {
      name: 'Hello',
      artist: 'Who',
      album: 'HelloAlbum',
      id: 11
      },
      {
        name: 'Hello1',
        artist: 'Who1',
        album: 'HelloAlbum1',
        id: 12
        }*/
    ],
    playlistName: 'New Playlist',
    playlistTracks: [/*{name: 'Yo1', artist: 'KD', album: 'NBA', id: 101}*/]
  };
  this.addTrack = this.addTrack.bind(this);
  this.removeTrack = this.removeTrack.bind(this);
  this.updatePlaylistName = this.updatePlaylistName.bind(this);
  this.search = this.search.bind(this);
  this.savePlaylist = this.savePlaylist.bind(this);
  Spotify.getAccessToken();
  }
  render() {
    return (
        <div>
          <h1>Ja<span className="highlight">mmm</span>ing</h1>
          <div className="App">
            <SearchBar onSearch={this.search} />
            <div className="App-playlist">
               <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} onRemove={this.removeTrack} />
               <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
            </div>
          </div>
        </div>
    );
  }

  addTrack(track){

    //console.log('Adding Track to', this.state.playlistTracks);

    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id))
    {
      return;
    }
    
    let playlistTracks2 = this.state.playlistTracks;
    playlistTracks2.push(track);
    this.setState({playlistTracks: playlistTracks2});
    // console.log('After adding Track', this.state.playlistTracks);
    
  }

  removeTrack(track){
    //console.log('REMOVING Track:', track);
    let playlistTracks2 = this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id);
    this.setState({playlistTracks: playlistTracks2});    
    
  }

  updatePlaylistName(name) {
     this.setState({playlistName: name});
  }

  savePlaylist() {
    let trackURIs=[];
    //console.log('Saving Playlist Tracks: ', this.state.playlistTracks);
    this.state.playlistTracks.forEach(function(track){
      //console.log('Track: ', track);
      trackURIs.push(track.URI);
    });
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    //let playlistName2 = 'New Playlist';
    let playlistTracks2 = [];
    this.setState({playlistTracks: playlistTracks2});
    this.setState({playlistName: 'New Playlist'});
    // console.log('State Playlist Name: ', this.state.playlistName);
  }

  search(searchTerm) {
    Spotify.search(searchTerm).then(tracks => {
      this.setState({searchResults: tracks});
    });
  }

} 

export default App;
