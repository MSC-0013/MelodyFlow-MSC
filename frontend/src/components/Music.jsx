import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute, FaRandom, FaRedo, FaList, FaSearch, FaFolderOpen, FaMusic, FaHeart, FaClock, FaPlus, FaHistory, FaStar, FaHome, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

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
  const [repeatMode, setRepeatMode] = useState('none'); // none, one, all
  const [currentSong, setCurrentSong] = useState({
    name: 'Song Name',
    artist: 'Artist Name',
    cover: 'https://via.placeholder.com/300',
    duration: '3:45'
  });

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

  // Initialize audio context and visualizer
  useEffect(() => {
    let audioContext = null;
    let analyser = null;

    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      
      if (audioRef.current) {
        const source = audioContext.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
      }
    } catch (error) {
      console.error("Error initializing audio context:", error);
    }

    return () => {
      if (analyser) {
        analyser.disconnect();
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  // Visualizer animation
  useEffect(() => {
    if (!isPlaying || !visualizerRef.current || !analyserRef.current) return;

    const canvas = visualizerRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isPlaying) return;

      requestAnimationFrame(draw);
      analyserRef.current.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        ctx.fillStyle = `hsl(${i * 360 / bufferLength}, 100%, 50%)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();
  }, [isPlaying]);

  // Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // File handling
  const handleFileSelection = (e) => {
    const files = Array.from(e.target.files);
    const audioFiles = files.filter((file) => file.type.startsWith("audio/"));

    if (audioFiles.length > 0) {
      const newPlaylist = audioFiles.map((file) => ({
        name: file.name.length > 100 ? `${file.name.substring(0, 100)}...` : file.name,
        url: URL.createObjectURL(file),
        file: file,
        addedDate: new Date().toISOString(),
        playCount: 0,
        duration: '0:00',
        isFavorite: false
      }));

      // Update playlist and current song
      setPlaylist(newPlaylist);
      setCurrentIndex(0);
      setCurrentSong(newPlaylist[0]);

      // Create and setup audio element
      const audio = new Audio(newPlaylist[0].url);
      
      // Add event listeners
      audio.addEventListener('loadedmetadata', () => {
        const duration = formatTime(audio.duration);
        setPlaylist(prev => prev.map((song, i) => 
          i === 0 ? { ...song, duration } : song
        ));
        setCurrentSong(prev => ({ ...prev, duration }));
        setDuration(audio.duration);
      });

      audio.addEventListener('error', (error) => {
        console.error("Audio loading error:", error);
      });

      // Update audio reference and start playback
      audioRef.current = audio;
      audio.play().catch(error => {
        console.error("Playback error:", error);
      });
      setIsPlaying(true);
    }
  };

  // Library organization
  const organizeLibrary = (songs) => {
    const organized = {
      artists: {},
      albums: {},
      genres: {}
    };

    songs.forEach(song => {
      // Extract metadata (you'll need to implement this)
      const metadata = {
        artist: "Unknown Artist",
        album: "Unknown Album",
        genre: "Unknown Genre"
      };

      // Organize by artist
      if (!organized.artists[metadata.artist]) {
        organized.artists[metadata.artist] = [];
      }
      organized.artists[metadata.artist].push(song);

      // Organize by album
      if (!organized.albums[metadata.album]) {
        organized.albums[metadata.album] = [];
      }
      organized.albums[metadata.album].push(song);

      // Organize by genre
      if (!organized.genres[metadata.genre]) {
        organized.genres[metadata.genre] = [];
      }
      organized.genres[metadata.genre].push(song);
    });

    setLibraryItems(organized);
  };

  // Playback controls
  const handlePlayPause = () => {
    if (audioRef.current && audioRef.current.src) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Playback error:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playNext = () => {
    if (!audioRef.current || !playlist.length) return;

    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      const nextIndex = shuffle
        ? Math.floor(Math.random() * playlist.length)
        : (currentIndex + 1) % playlist.length;
      
      handleSongClick(playlist[nextIndex], nextIndex);
    }
  };

  const playPrev = () => {
    if (!audioRef.current || !playlist.length) return;

    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    handleSongClick(playlist[prevIndex], prevIndex);
  };

  // Progress bar handling
  const handleProgressMouseDown = (e) => {
    setIsDraggingProgress(true);
    updateProgress(e);
  };

  const handleProgressMouseMove = (e) => {
    if (!isDraggingProgress) return;
    updateProgress(e);
  };

  const handleProgressMouseUp = () => {
    setIsDraggingProgress(false);
  };

  const updateProgress = (e) => {
    if (!audioRef.current || !progressBarRef.current) return;
    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newTime = (offsetX / progressBar.offsetWidth) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Volume control
  const handleVolumeMouseDown = (e) => {
    setIsDraggingVolume(true);
    updateVolume(e);
  };

  const handleVolumeMouseMove = (e) => {
    if (!isDraggingVolume) return;
    updateVolume(e);
  };

  const handleVolumeMouseUp = () => {
    setIsDraggingVolume(false);
  };

  const updateVolume = (e) => {
    if (!audioRef.current || !volumeBarRef.current) return;
    const volumeBar = volumeBarRef.current;
    const rect = volumeBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newVolume = Math.max(0, Math.min(1, offsetX / volumeBar.offsetWidth));
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    setVolumeTooltipPosition(newVolume * 100);
  };

  // Context menu
  const handleContextMenu = (e, item) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuItem(item);
    setShowContextMenu(true);
  };

  const handleContextMenuAction = (action) => {
    switch (action) {
      case "addToPlaylist":
        // Implement add to playlist
        break;
      case "addToFavorites":
        // Implement add to favorites
        break;
      case "removeFromPlaylist":
        // Implement remove from playlist
        break;
      case "showInfo":
        // Implement show info
        break;
      default:
        break;
    }
    setShowContextMenu(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.code) {
        case "Space":
          e.preventDefault();
          handlePlayPause();
          break;
        case "ArrowRight":
          playNext();
          break;
        case "ArrowLeft":
          playPrev();
          break;
        case "ArrowUp":
          setVolume(Math.min(1, volume + 0.1));
          audioRef.current.volume = volume;
          break;
        case "ArrowDown":
          setVolume(Math.max(0, volume - 0.1));
          audioRef.current.volume = volume;
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isPlaying, volume]);

  // Time formatting
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Mini player drag functionality
  const handleMiniPlayerMouseDown = (e) => {
    if (e.target.closest('.control-btn')) return;
    setIsDraggingMiniPlayer(true);
    const rect = miniPlayerRef.current.getBoundingClientRect();
    setMiniPlayerPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMiniPlayerMouseMove = (e) => {
    if (!isDraggingMiniPlayer) return;
    const x = e.clientX - miniPlayerPosition.x;
    const y = e.clientY - miniPlayerPosition.y;
    miniPlayerRef.current.style.left = `${x}px`;
    miniPlayerRef.current.style.top = `${y}px`;
  };

  const handleMiniPlayerMouseUp = () => {
    setIsDraggingMiniPlayer(false);
  };

  // Add to queue functionality
  const addToQueue = (song) => {
    setQueue(prevQueue => [...prevQueue, song]);
  };

  // Play from queue
  const playFromQueue = (index) => {
    const song = queue[index];
    setPlaylist(prevPlaylist => [...prevPlaylist, song]);
    setCurrentIndex(playlist.length);
    audioRef.current.src = song.url;
    audioRef.current.play();
    setIsPlaying(true);
    setQueue(prevQueue => prevQueue.filter((_, i) => i !== index));
  };

  // Enhanced statistics tracking
  const updateStatistics = (newPlaylist) => {
    setStatistics(prevStats => ({
      ...prevStats,
      totalPlayTime: prevStats.totalPlayTime + (audioRef.current?.duration || 0),
      songsPlayed: prevStats.songsPlayed + 1
    }));
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleSongEnd);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleSongEnd);
      }
    };
  }, []);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
      if (progressBarRef.current) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBarRef.current.style.width = `${progress}%`;
      }
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) {
      const duration = formatTime(audio.duration);
      setDuration(audio.duration);
      setPlaylist(prev => prev.map((song, i) => 
        i === currentIndex ? { ...song, duration } : song
      ));
      setCurrentSong(prev => ({ ...prev, duration }));
    }
  };

  const handleSongEnd = () => {
    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (repeatMode === 'all' || shuffle) {
      playNext();
    } else {
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    if (audio && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const newTime = pos * audio.duration;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const audio = audioRef.current;
    if (audio && volumeBarRef.current) {
      const rect = volumeBarRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const newVolume = Math.max(0, Math.min(1, pos));
      setVolume(newVolume);
      audio.volume = newVolume;
      setIsMuted(newVolume === 0);
      setVolumeTooltipPosition(newVolume * 100);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      setIsMuted(!isMuted);
      audio.volume = isMuted ? volume : 0;
    }
  };

  const toggleShuffle = () => {
    setShuffle(!shuffle);
    if (!shuffle) {
      setRepeatMode('none');
    }
  };

  const toggleRepeat = () => {
    const modes = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  // Update song click handler
  const handleSongClick = (song, index) => {
    try {
      // Stop current playback if any
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Update current song and index
      setCurrentIndex(index);
      setCurrentSong(song);
      
      // Update recently played
      setRecentlyPlayed(prev => {
        const filtered = prev.filter(s => s.url !== song.url);
        return [song, ...filtered].slice(0, 10);
      });
      
      // Create new audio element
      const audio = new Audio(song.url);
      
      // Add event listeners
      audio.addEventListener('loadedmetadata', () => {
        const duration = formatTime(audio.duration);
        setPlaylist(prev => prev.map((s, i) => 
          i === index ? { ...s, duration } : s
        ));
        setCurrentSong(prev => ({ ...prev, duration }));
        setDuration(audio.duration);
      });

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
        if (progressBarRef.current) {
          const progress = (audio.currentTime / audio.duration) * 100;
          progressBarRef.current.style.width = `${progress}%`;
        }
      });

      audio.addEventListener('error', (error) => {
        console.error("Audio loading error:", error);
        setCurrentSong(prev => ({ ...prev, duration: '0:00' }));
      });

      // Update audio reference and start playback
      audioRef.current = audio;
      audio.play().catch(error => {
        console.error("Playback error:", error);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    } catch (error) {
      console.error("Error in handleSongClick:", error);
      setIsPlaying(false);
    }
  };

  // Update handleLogout function
  const handleLogout = () => {
    // Stop audio playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Clean up audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    // Clear playlist and state
    setPlaylist([]);
    setCurrentSong({
      name: 'Song Name',
      artist: 'Artist Name',
      cover: 'https://via.placeholder.com/300',
      duration: '0:00'
    });
    setCurrentIndex(0);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setVolume(1);
    setIsMuted(false);
    setFavorites([]);
    setRecentlyPlayed([]);

    // Only clear auth token and current session data
    // Don't clear user registration data
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('playlist');
    localStorage.removeItem('favorites');
    localStorage.removeItem('recentlyPlayed');

    // Navigate to login
    navigate('/login');
  };

  // Add toggle favorite function
  const toggleFavorite = (song, index) => {
    setPlaylist(prev => prev.map((s, i) => 
      i === index ? { ...s, isFavorite: !s.isFavorite } : s
    ));
    
    if (song.isFavorite) {
      setFavorites(prev => prev.filter(s => s.url !== song.url));
    } else {
      setFavorites(prev => [...prev, { ...song, isFavorite: true }]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 transition-colors lg:hidden"
      >
        <div className="w-6 h-0.5 bg-white mb-1.5"></div>
        <div className="w-6 h-0.5 bg-white mb-1.5"></div>
        <div className="w-6 h-0.5 bg-white"></div>
      </button>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-orange-900/20 backdrop-blur-lg border-r border-orange-500/20 p-4 flex flex-col transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 shadow-2xl shadow-orange-500/10 z-40`}>
        <div className="flex items-center gap-2 mb-8">
          <FaMusic className="text-orange-500 text-2xl" />
          <h1 className="text-xl font-bold">Music Player</h1>
        </div>
        
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === 'all' 
                ? 'bg-orange-500 text-white' 
                : 'hover:bg-orange-500/20 text-gray-300'
            }`}
          >
            <FaHome />
            <span>All Music</span>
          </button>
          
          <button
            onClick={() => setActiveTab('recent')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === 'recent' 
                ? 'bg-orange-500 text-white' 
                : 'hover:bg-orange-500/20 text-gray-300'
            }`}
          >
            <FaHistory />
            <span>Recently Played</span>
          </button>
          
          <button
            onClick={() => setActiveTab('favorites')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === 'favorites' 
                ? 'bg-orange-500 text-white' 
                : 'hover:bg-orange-500/20 text-gray-300'
            }`}
          >
            <FaStar />
            <span>Favorites</span>
          </button>

          {/* Logout Button - Moved under favorites */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-300 mt-2"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
          
          <button
            onClick={() => fileInputRef.current.click()}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-orange-500/20 text-gray-300 transition-all duration-300"
          >
            <FaFolderOpen />
            <span>Add Folder</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`lg:ml-64 p-4 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} h-screen overflow-hidden`}>
        {/* Welcome Section */}
        {playlist.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h2 className="text-4xl font-bold text-orange-500 mb-4">
              Welcome to Your Music Player
            </h2>
            <p className="text-gray-400 mb-8">
              Add your music folder to get started
            </p>
            <button
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/30"
            >
              <FaFolderOpen className="text-xl" />
              <span>Add Music Folder</span>
            </button>
          </div>
        )}

        {/* Playlist Section */}
        {playlist.length > 0 && (
          <div className="bg-black/50 backdrop-blur-lg rounded-xl shadow-2xl shadow-orange-500/10 overflow-hidden border border-orange-500/20 h-[calc(100vh-120px)]">
            <div className="p-4 border-b border-orange-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaMusic className="text-orange-500 text-xl" />
                  <h2 className="text-xl font-semibold">
                    {activeTab === 'all' ? 'All Music' : 
                     activeTab === 'recent' ? 'Recently Played' : 
                     'Favorites'}
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search songs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-black/50 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[calc(100%-80px)] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500/50 scrollbar-track-transparent">
              <ul className="divide-y divide-orange-500/20">
                {(activeTab === 'all' ? playlist :
                  activeTab === 'recent' ? recentlyPlayed :
                  favorites)
                  .filter((song) =>
                    song.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((song, index) => (
                    <li
                      key={index}
                      className={`flex items-center justify-between p-4 hover:bg-orange-500/10 cursor-pointer transition-all duration-300 ${
                        index === currentIndex ? 'bg-orange-500/20' : ''
                      }`}
                      onClick={() => handleSongClick(song, index)}
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                          <FaMusic className="text-orange-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-4">
                            <h3 className="font-medium text-lg truncate max-w-[800px]">
                              {song.name}
                            </h3>
                            <span className="text-sm text-gray-400 whitespace-nowrap">
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
                        className={`p-2 text-gray-400 hover:text-orange-500 transition-colors ${
                          song.isFavorite ? 'text-orange-500' : ''
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

      {/* Fixed Bottom Player */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-orange-500/20 shadow-2xl shadow-orange-500/10 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Song Info */}
            <div className="flex items-center gap-4 w-1/3">
              <div className="w-16 h-16 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <FaMusic className="text-orange-500 text-2xl" />
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-lg truncate max-w-[300px]">
                  {currentSong.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{currentSong.duration}</span>
                  <span>•</span>
                  <span>{playlist.length} songs</span>
                </div>
              </div>
            </div>

            {/* Player Controls */}
            <div className="flex flex-col items-center gap-4 w-1/3">
              <div className="flex items-center gap-6">
                <button
                  onClick={toggleShuffle}
                  className={`p-2 rounded-full hover:bg-orange-500/20 transition-colors ${
                    shuffle ? 'text-orange-500' : 'text-gray-400'
                  }`}
                >
                  <FaRandom className="text-xl" />
                </button>
                <button
                  onClick={playPrev}
                  className="p-2 rounded-full hover:bg-orange-500/20 text-gray-400 transition-colors"
                >
                  <FaStepBackward className="text-xl" />
                </button>
                <button
                  onClick={handlePlayPause}
                  className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <button
                  onClick={playNext}
                  className="p-2 rounded-full hover:bg-orange-500/20 text-gray-400 transition-colors"
                >
                  <FaStepForward className="text-xl" />
                </button>
                <button
                  onClick={toggleRepeat}
                  className={`p-2 rounded-full hover:bg-orange-500/20 transition-colors ${
                    repeatMode !== 'none' ? 'text-orange-500' : 'text-gray-400'
                  }`}
                >
                  <FaRedo className="text-xl" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full flex items-center gap-2">
                <span className="text-sm text-gray-400 min-w-[45px] text-right">
                  {formatTime(currentTime)}
                </span>
                <div
                  ref={progressBarRef}
                  className="flex-1 h-1.5 bg-orange-500/20 rounded-full cursor-pointer relative group"
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
                    className="absolute h-full bg-orange-500 rounded-full transition-all duration-100"
                    style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                  />
                  <div className="absolute -top-8 bg-black/90 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity time-tooltip">
                    {formatTime(currentTime)}
                  </div>
                </div>
                <span className="text-sm text-gray-400 min-w-[45px]">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2 w-1/3 justify-end">
              <button
                onClick={toggleMute}
                className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
              >
                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
              <div
                ref={volumeBarRef}
                className="w-32 h-1 bg-orange-500/20 rounded-full cursor-pointer relative group"
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
                  className="absolute h-full bg-orange-500 rounded-full transition-all duration-100"
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