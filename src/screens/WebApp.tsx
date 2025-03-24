import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import './WebApp.css';

const WebApp = () => {
  const [activeTab, setActiveTab] = useState('Знакомства');
  const [mapView, setMapView] = useState('list');
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [matches, setMatches] = useState([
    {
      id: 1,
      name: 'Katie',
      age: 25,
      distance: '2 км',
      photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
      online: true,
      job: 'Designer at Abercrombie',
      education: 'Stanford University'
    },
    {
      id: 2,
      name: 'Sarah',
      age: 26,
      distance: '1 км',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      online: true,
      job: 'Marketing Manager',
      education: 'NYU'
    },
    {
      id: 3,
      name: 'Claire',
      age: 24,
      distance: '3 км',
      photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
      online: true,
      job: 'Photographer',
      education: 'Art Institute'
    },
    {
      id: 4,
      name: 'Lilly',
      age: 23,
      distance: '2 км',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      online: true
    },
    {
      id: 5,
      name: 'Bonnie',
      age: 25,
      distance: '5 км',
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
      online: true
    },
    {
      id: 6,
      name: 'Jane',
      age: 22,
      distance: '4 км',
      photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
      online: true
    },
    {
      id: 7,
      name: 'Lisa',
      age: 27,
      distance: '6 км',
      photo: 'https://images.unsplash.com/photo-1526510747491-58f928ec870f',
      online: true
    },
    {
      id: 8,
      name: 'Laura',
      age: 24,
      distance: '2 км',
      photo: 'https://images.unsplash.com/photo-1504703395950-b89145a5425b',
      online: true
    },
    {
      id: 9,
      name: 'Eva',
      age: 23,
      distance: '5 км',
      photo: 'https://images.unsplash.com/photo-1514315384763-ba401779410f',
      online: true
    },
    {
      id: 10,
      name: 'Anna',
      age: 26,
      distance: '4 км',
      photo: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43',
      online: true
    }
  ]);

  const [chats] = useState([
    {
      id: 1,
      name: 'Мария',
      lastMessage: 'Привет! Как дела?',
      time: '12:30',
      unread: 2,
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
    },
    {
      id: 2,
      name: 'Елена',
      lastMessage: 'Давай встретимся завтра',
      time: '10:15',
      unread: 0,
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9'
    }
  ]);

  const userProfile = {
    name: 'Анна',
    age: 25,
    location: 'Москва',
    bio: 'Люблю путешествия, фотографию и хорошую музыку. В поисках интересных знакомств и новых впечатлений.',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1'
    ],
    interests: ['Путешествия', 'Фотография', 'Музыка', 'Спорт', 'Искусство']
  };

  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [swipePosition, setSwipePosition] = useState({ x: 0, y: 0 });

  const handlePrevProfile = () => {
    if (currentProfileIndex > 0) {
      setCurrentProfileIndex(currentProfileIndex - 1);
    }
  };

  const handleNextProfile = () => {
    if (currentProfileIndex < matches.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    }
  };

  const handleLike = () => {
    console.log('Liked profile:', matches[currentProfileIndex].name);
    handleNextProfile();
  };

  const handleDislike = () => {
    console.log('Disliked profile:', matches[currentProfileIndex].name);
    handleNextProfile();
  };

  const handleSuperLike = () => {
    console.log('Super liked profile:', matches[currentProfileIndex].name);
    handleNextProfile();
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleDislike,
    onSwipedRight: handleLike,
    onSwiping: (eventData) => {
      if (eventData.dir === 'Left') {
        setSwipeDirection('left');
        setSwipePosition({ x: eventData.deltaX, y: 0 });
      } else if (eventData.dir === 'Right') {
        setSwipeDirection('right');
        setSwipePosition({ x: eventData.deltaX, y: 0 });
      }
    },
    onSwiped: () => {
      setSwipeDirection(null);
      setSwipePosition({ x: 0, y: 0 });
    },
    trackMouse: true
  });

  const renderMatches = () => {
    const currentProfile = matches[currentProfileIndex];
    const cardStyle = {
      transform: `translate(${swipePosition.x}px, ${swipePosition.y}px) rotate(${swipePosition.x * 0.1}deg)`,
      transition: swipePosition.x === 0 ? 'transform 0.3s ease' : 'none'
    };

    return (
      <div className="swipe-screen">
        <div className="app-header">
          <h1 className="app-title">amoo</h1>
        </div>
        
        <div {...swipeHandlers} className="profile-card" data-swiping={swipeDirection} style={cardStyle}>
          <div className="profile-photo-container">
            <img src={currentProfile.photo} alt={currentProfile.name} className="profile-photo" />
            <div className="profile-info">
              <div className="profile-name-verified">
                <h2>{currentProfile.name}, {currentProfile.age}</h2>
                <span className="verified-badge">✓</span>
              </div>
              <p className="profile-job">{currentProfile.job}</p>
              <p className="profile-education">{currentProfile.education}</p>
            </div>
          </div>

          <div className="action-buttons">
            <button className="action-btn undo" onClick={handlePrevProfile}>
              ↩️
            </button>
            <button className="action-btn superlike" onClick={handleSuperLike}>
              ⭐
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderMap = () => (
    <div className="map-screen">
      <div className="app-header">
        <h1 className="app-title">amoo</h1>
      </div>
      <div className="map-header">
        <button 
          className={`view-toggle-btn ${mapView === 'map' ? 'active' : ''}`}
          onClick={() => setMapView('map')}
        >
          <span className="view-toggle-icon">🗺️</span>
          Карта
        </button>
        <button 
          className={`view-toggle-btn ${mapView === 'list' ? 'active' : ''}`}
          onClick={() => setMapView('list')}
        >
          <span className="view-toggle-icon">👥</span>
          Список
        </button>
      </div>

      {mapView === 'map' ? (
        <div className="map-container">
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=37.5,55.7,37.7,55.8&layer=mapnik"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            title="Map"
          />
          <div className="nearby-users">
            {matches.slice(0, 3).map(user => (
              <div key={user.id} className="nearby-user-card">
                <img src={user.photo} alt={user.name} />
                <div className="nearby-user-info">
                  <h4>{user.name}, {user.age}</h4>
                  <p>{user.distance}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="users-grid">
          {matches.map(user => (
            <div key={user.id} className="user-circle">
              <div className="user-photo-container">
                <img src={user.photo} alt={user.name} className="user-photo" />
                <div className="online-indicator"></div>
              </div>
              <p className="user-name">{user.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderLive = () => (
    <div className="live-container">
      <div className="app-header">
        <h1 className="app-title">amoo</h1>
      </div>
      <div className="live-grid">
        {matches.map(user => (
          <div key={user.id} className="live-card">
            <div className="live-stream-placeholder">
              <img src={user.photo} alt={user.name} />
              <div className="live-badge">LIVE</div>
            </div>
            <div className="live-info">
              <h4>{user.name}, {user.age}</h4>
              <p>{user.distance}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderChats = () => (
    <div className="chats-container">
      <div className="app-header">
        <h1 className="app-title">amoo</h1>
      </div>
      {chats.map(chat => (
        <div key={chat.id} className="chat-item">
          <img src={chat.photo} alt={chat.name} className="chat-photo" />
          <div className="chat-content">
            <div className="chat-header">
              <h4>{chat.name}</h4>
              <span className="chat-time">{chat.time}</span>
            </div>
            <p className="chat-message">{chat.lastMessage}</p>
          </div>
          {chat.unread > 0 && (
            <div className="unread-badge">{chat.unread}</div>
          )}
        </div>
      ))}
    </div>
  );

  const renderProfile = () => (
    <div className="profile">
      <div className="app-header">
        <h1 className="app-title">amoo</h1>
      </div>
      <div className="profile-header">
        <img src={userProfile.photos[0]} alt={userProfile.name} className="profile-photo" />
        <h2>{userProfile.name}, {userProfile.age}</h2>
        <p>{userProfile.location}</p>
      </div>

      <div className="profile-section">
        <h3>О себе</h3>
        <p>{userProfile.bio}</p>
      </div>

      <div className="profile-section">
        <h3>Фотографии</h3>
        <div className="photos-grid">
          {userProfile.photos.map((photo, index) => (
            <img key={index} src={photo} alt={`Фото ${index + 1}`} className="photo" />
          ))}
          <button className="add-photo-btn">+</button>
        </div>
      </div>

      <div className="profile-section">
        <h3>Интересы</h3>
        <div className="interests-container">
          {userProfile.interests.map((interest, index) => (
            <span key={index} className="interest-tag">{interest}</span>
          ))}
          <button className="add-interest-btn">+</button>
        </div>
      </div>

      <div className="profile-section">
        <h3>Настройки</h3>
        <div className="settings-list">
          {[
            'Редактировать профиль',
            'Уведомления',
            'Конфиденциальность',
            'Помощь',
            'Выйти'
          ].map((item, index) => (
            <button key={index} className="settings-item">{item}</button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Знакомства':
        return renderMatches();
      case 'Карта':
        return renderMap();
      case 'Эфир':
        return renderLive();
      case 'Чаты':
        return renderChats();
      case 'Профиль':
        return renderProfile();
      default:
        return renderProfile();
    }
  };

  return (
    <div className="app">
      <main className="main">
        {renderContent()}
      </main>

      <nav className="nav">
        {[
          { name: 'Знакомства', icon: '❤️' },
          { name: 'Карта', icon: '🗺️' },
          { name: 'Эфир', icon: '📻' },
          { name: 'Чаты', icon: '💬' },
          { name: 'Профиль', icon: '👤' }
        ].map(tab => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`nav-button ${activeTab === tab.name ? 'active' : ''}`}
          >
            <span className="nav-icon">{tab.icon}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default WebApp; 