import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute, FaRandom, FaRedo, FaList, FaSearch, FaFolderOpen, FaMusic, FaHeart, FaClock, FaPlus, FaHistory, FaStar, FaHome, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import jsmediatags from 'jsmediatags';

const Music = () => {
  const navigate = useNavigate();

  // State variables
  const [isPlaying, setIsPlaying] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryView, setLibraryView] = useState("all");
  const [libraryItems, setLibraryItems] = useState([]);
  const [selectedLibraryItem, setSelectedLibraryItem] = useState(null);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuItem, setContextMenuItem] = useState(null);
  const [showLyrics, setShowLyrics] = useState(false);
  const [lyrics, setLyrics] = useState([]);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [showEqualizer, setShowEqualizer] = useState(false);
  const [equalizerSettings, setEqualizerSettings] = useState({
    bass: 0,
    mid: 0,
    treble: 0,
    preset: "flat"
  });
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  const [miniPlayerPosition, setMiniPlayerPosition] = useState({ x: 0, y: 0 });
  const [isDraggingMiniPlayer, setIsDraggingMiniPlayer] = useState(false);
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState("Default Playlist");
  const [showQueue, setShowQueue] = useState(false);
  const [queue, setQueue] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    crossfade: false,
    crossfadeDuration: 5,
    gaplessPlayback: true,
    highQuality: true,
    normalizeVolume: false
  });
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [statistics, setStatistics] = useState({
    totalPlayTime: 0,
    songsPlayed: 0,
    favoriteGenres: [],
    topArtists: []
  });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none');
  const [currentSong, setCurrentSong] = useState({
    name: 'Song Name',
    artist: 'Artist Name',
    cover: 'https://via.placeholder.com/300',
    duration: '3:45'
  });

  // Add new state for metadata
  const [metadata, setMetadata] = useState({});

  // Add new state for sidebar
  const [activeTab, setActiveTab] = useState('all');
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Refs
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const progressBarRef = useRef(null);
  const volumeBarRef = useRef(null);
  const contextMenuRef = useRef(null);
  const lyricsPanelRef = useRef(null);
  const equalizerRef = useRef(null);
  const visualizerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const miniPlayerRef = useRef(null);
  const playlistDropdownRef = useRef(null);
  const queueRef = useRef(null);
  const settingsRef = useRef(null);
  const statisticsRef = useRef(null);

  // Add new state for sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showVolumeTooltip, setShowVolumeTooltip] = useState(false);
  const [volumeTooltipPosition, setVolumeTooltipPosition] = useState(0);

  // Enhanced responsive states
  const [screenSize, setScreenSize] = useState({
    isMobile: window.innerWidth < 640,
    isTablet: window.innerWidth >= 640 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,
    isLargeDesktop: window.innerWidth >= 1280,
    width: window.innerWidth,
    height: window.innerHeight
  });

  // ... rest of your existing code ...

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Mobile Menu Button - Enhanced */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 lg:hidden backdrop-blur-sm active:scale-95"
        aria-label="Toggle menu"
      >
        <div className="w-6 h-0.5 bg-white mb-1.5 transition-transform duration-300"></div>
        <div className="w-6 h-0.5 bg-white mb-1.5 transition-transform duration-300"></div>
        <div className="w-6 h-0.5 bg-white transition-transform duration-300"></div>
      </button>

      {/* Sidebar - Enhanced */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-black/80 backdrop-blur-xl border-r border-white/5 p-4 flex flex-col transform transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 shadow-2xl shadow-white/5 z-40`}>
        <div className="flex items-center gap-2 mb-8">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
            <FaMusic className="text-white text-2xl" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">MelodyFlow</h1>
        </div>
        
        <nav className="space-y-2 flex-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === 'all' 
                ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white' 
                : 'hover:bg-white/10 text-gray-300'
            }`}
          >
            <FaHome />
            <span>All Music</span>
          </button>
          
          <button
            onClick={() => setActiveTab('recent')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === 'recent' 
                ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white' 
                : 'hover:bg-white/10 text-gray-300'
            }`}
          >
            <FaHistory />
            <span>Recently Played</span>
          </button>
          
          <button
            onClick={() => setActiveTab('favorites')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === 'favorites' 
                ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white' 
                : 'hover:bg-white/10 text-gray-300'
            }`}
          >
            <FaStar />
            <span>Favorites</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-300 mt-4"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`lg:ml-64 p-4 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} h-screen overflow-hidden`}>
        {/* Welcome Section */}
        {playlist.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 sm:px-6 md:px-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Welcome to MelodyFlow
            </h2>
            <p className="text-gray-400 mb-8 max-w-md text-sm sm:text-base">
              Add your local music to get started
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <button
                onClick={() => fileInputRef.current.click()}
                className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-white/10 active:scale-95"
              >
                <FaFolderOpen className="text-xl" />
                <span className="text-sm sm:text-base">Add Local Music</span>
              </button>
            </div>
          </div>
        )}

        {/* Playlist Section - Enhanced */}
        {playlist.length > 0 && (
          <div className="bg-gradient-to-b from-black/80 to-black/50 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] overflow-hidden h-[calc(100vh-120px)] relative border-0">
            {/* Glowing border effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 blur-xl"></div>
            
            {/* Header Section */}
            <div className="p-4 relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                    <FaMusic className="text-white text-xl" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {activeTab === 'all' ? 'All Music' : 
                     activeTab === 'recent' ? 'Recently Played' : 
                     'Favorites'}
                  </h2>
                </div>
                <div className="w-full sm:w-auto">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search songs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white/5 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 backdrop-blur-sm text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Playlist Content */}
            <div className="h-[calc(100%-80px)] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent relative pb-20">
              <ul className="divide-y divide-white/5">
                {(activeTab === 'all' ? playlist :
                  activeTab === 'recent' ? recentlyPlayed :
                  favorites)
                  .filter((song) =>
                    song.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((song, index) => (
                    <li
                      key={index}
                      className={`flex items-center justify-between p-3 sm:p-4 hover:bg-white/5 cursor-pointer transition-all duration-300 group ${
                        index === currentIndex ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10' : ''
                      }`}
                      onClick={() => handleSongClick(song, index)}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <img
                          src={song.cover}
                          alt={song.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                            <div>
                              <h3 className="font-medium text-base sm:text-lg truncate max-w-[800px] group-hover:text-white transition-colors duration-300">
                                {song.name}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-400 truncate">
                                {song.artist} • {song.album}
                              </p>
                            </div>
                            <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap group-hover:text-white transition-colors duration-300">
                              {song.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(song, index);
                        }}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          song.isFavorite 
                            ? 'text-purple-500 hover:bg-purple-500/10' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <FaHeart />
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Player - Enhanced */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl shadow-2xl shadow-white/5 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
            {/* Song Info */}
            <div className="flex items-center gap-3 sm:gap-4 w-full md:w-1/3">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                <FaMusic className="text-white text-xl sm:text-2xl" />
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-sm sm:text-lg truncate max-w-[300px]">
                  {currentSong.name}
                </h3>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                  <span>{currentSong.duration}</span>
                  <span>•</span>
                  <span>{playlist.length} songs</span>
                </div>
              </div>
            </div>

            {/* Player Controls */}
            <div className="flex flex-col items-center gap-3 sm:gap-4 w-full md:w-1/3">
              <div className="flex items-center gap-4 sm:gap-6">
                <button
                  onClick={toggleShuffle}
                  className={`p-2 rounded-full hover:bg-white/10 transition-colors ${
                    shuffle ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  <FaRandom className="text-lg sm:text-xl" />
                </button>
                <button
                  onClick={playPrev}
                  className="p-2 rounded-full hover:bg-white/10 text-gray-400 transition-colors"
                >
                  <FaStepBackward className="text-lg sm:text-xl" />
                </button>
                <button
                  onClick={handlePlayPause}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center hover:from-purple-600 hover:to-blue-600 transition-colors active:scale-95"
                >
                  {isPlaying ? <FaPause className="text-lg sm:text-xl" /> : <FaPlay className="text-lg sm:text-xl" />}
                </button>
                <button
                  onClick={playNext}
                  className="p-2 rounded-full hover:bg-white/10 text-gray-400 transition-colors"
                >
                  <FaStepForward className="text-lg sm:text-xl" />
                </button>
                <button
                  onClick={toggleRepeat}
                  className={`p-2 rounded-full hover:bg-white/10 transition-colors ${
                    repeatMode !== 'none' ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  <FaRedo className="text-lg sm:text-xl" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-400 min-w-[45px] text-right">
                  {formatTime(currentTime)}
                </span>
                <div
                  ref={progressBarRef}
                  className="flex-1 h-1 sm:h-1.5 bg-white/10 rounded-full cursor-pointer relative group"
                  onClick={handleProgressClick}
                  onMouseDown={handleProgressMouseDown}
                  onMouseMove={handleProgressMouseMove}
                  onMouseUp={handleProgressMouseUp}
                  onMouseLeave={handleProgressMouseUp}
                  onTouchStart={handleProgressMouseDown}
                  onTouchMove={handleProgressMouseMove}
                  onTouchEnd={handleProgressMouseUp}
                >
                  <div
                    className="absolute h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-100"
                    style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                  />
                  <div className="absolute -top-8 bg-black/90 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity time-tooltip">
                    {formatTime(currentTime)}
                  </div>
                </div>
                <span className="text-xs sm:text-sm text-gray-400 min-w-[45px]">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2 w-full md:w-1/3 justify-center md:justify-end">
              <button
                onClick={toggleMute}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                {isMuted ? <FaVolumeMute className="text-lg sm:text-xl" /> : <FaVolumeUp className="text-lg sm:text-xl" />}
              </button>
              <div
                ref={volumeBarRef}
                className="w-24 sm:w-32 h-1 sm:h-1.5 bg-white/10 rounded-full cursor-pointer relative group"
                onClick={handleVolumeChange}
                onMouseDown={handleVolumeMouseDown}
                onMouseMove={handleVolumeMouseMove}
                onMouseUp={handleVolumeMouseUp}
                onMouseLeave={handleVolumeMouseUp}
                onTouchStart={handleVolumeMouseDown}
                onTouchMove={handleVolumeMouseMove}
                onTouchEnd={handleVolumeMouseUp}
              >
                <div
                  className="absolute h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-100"
                  style={{ width: `${volume * 100}%` }}
                />
                <div className={`absolute -top-8 bg-black/90 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity`}>
                  {Math.round(volume * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        webkitdirectory="true"
        directory="true"
        multiple
        hidden
        onChange={handleFileSelection}
      />

      {/* Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleSongEnd}
        onError={(e) => {
          console.error("Audio error:", e);
        }}
        preload="auto"
      />
    </div>
  );
};

export default Music; 