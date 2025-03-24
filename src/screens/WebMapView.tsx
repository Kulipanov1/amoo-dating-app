import React, { useState } from 'react';

interface WebMapViewProps {
  location: {
    latitude: number;
    longitude: number;
  };
  users: Array<{
    id: number;
    name: string;
    age: number;
    distance: string;
    image: string;
    isOnline: boolean;
    lastActive: string;
  }>;
}

const WebMapView: React.FC<WebMapViewProps> = ({ location, users }) => {
  const [selectedDistance, setSelectedDistance] = useState<number>(10);
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - 0.1}%2C${location.latitude - 0.1}%2C${location.longitude + 0.1}%2C${location.latitude + 0.1}&layer=mapnik&marker=${location.latitude}%2C${location.longitude}`;

  return (
    <div style={{ 
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#f5f5f5',
      overflow: 'hidden'
    }}>
      <iframe
        style={{ 
          border: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
        src={mapUrl}
        title="OpenStreetMap"
      />
      
      {/* Фильтр расстояния */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 1000,
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <div style={{ 
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '10px'
        }}>
          Расстояние: {selectedDistance} км
        </div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {[1, 2, 5, 10, 25, 50].map((distance) => (
            <button
              key={distance}
              onClick={() => setSelectedDistance(distance)}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: selectedDistance === distance ? '#8A2BE2' : '#f0f0f0',
                color: selectedDistance === distance ? 'white' : '#666',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }}
            >
              {distance}
            </button>
          ))}
        </div>
      </div>

      {/* Список пользователей */}
      <div style={{
        position: 'absolute',
        top: '100px',
        right: '20px',
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxWidth: '300px',
        maxHeight: 'calc(100vh - 240px)',
        overflowY: 'auto',
        zIndex: 1000
      }}>
        <div style={{ 
          fontSize: '16px',
          fontWeight: 'bold',
          marginBottom: '15px',
          color: '#333'
        }}>
          Пользователи поблизости
        </div>
        {users.map((user) => (
          <div
            key={user.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              backgroundColor: '#f8f8f8',
              borderRadius: '8px',
              marginBottom: '10px',
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
          >
            <img
              src={user.image}
              alt={user.name}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '25px',
                marginRight: '12px',
                objectFit: 'cover'
              }}
            />
            <div>
              <div style={{ 
                fontWeight: 'bold',
                fontSize: '16px',
                color: '#333',
                marginBottom: '4px'
              }}>
                {user.name}, {user.age}
              </div>
              <div style={{ 
                fontSize: '14px',
                color: '#666',
                marginBottom: '4px'
              }}>
                {user.distance}
              </div>
              <div style={{
                fontSize: '12px',
                color: user.isOnline ? '#4CAF50' : '#666',
                display: 'flex',
                alignItems: 'center'
              }}>
                {user.isOnline && (
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#4CAF50',
                    display: 'inline-block',
                    marginRight: '4px'
                  }} />
                )}
                {user.isOnline ? 'Онлайн' : user.lastActive}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebMapView; 