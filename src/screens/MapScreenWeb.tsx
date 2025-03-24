import React from 'react';

const MapScreenWeb = () => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <iframe
        src="https://www.openstreetmap.org/export/embed.html?bbox=37.5178%2C55.7317%2C37.7178%2C55.7717&layer=mapnik"
        style={{
          border: 'none',
          width: '100%',
          height: '100%'
        }}
        title="OpenStreetMap"
      />
      
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 1000
      }}>
        <div style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '10px'
        }}>
          Расстояние поиска
        </div>
        <div style={{
          display: 'flex',
          gap: '10px'
        }}>
          {[1, 2, 5, 10, 25, 50].map((distance) => (
            <button
              key={distance}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: '#f0f0f0',
                cursor: 'pointer'
              }}
            >
              {distance} км
            </button>
          ))}
        </div>
      </div>

      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 1000,
        width: '250px'
      }}>
        <div style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '15px'
        }}>
          Пользователи поблизости
        </div>
        {[
          { name: 'Анна', age: 25, distance: '2 км', online: true },
          { name: 'Мария', age: 28, distance: '3 км', online: false },
          { name: 'Екатерина', age: 24, distance: '1.5 км', online: true }
        ].map((user, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              backgroundColor: '#f8f8f8',
              borderRadius: '8px',
              marginBottom: '10px'
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '20px',
              backgroundColor: '#ddd',
              marginRight: '10px'
            }} />
            <div>
              <div style={{
                fontWeight: 'bold',
                color: '#333'
              }}>
                {user.name}, {user.age}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#666'
              }}>
                {user.distance}
              </div>
              <div style={{
                fontSize: '12px',
                color: user.online ? '#4CAF50' : '#666',
                display: 'flex',
                alignItems: 'center'
              }}>
                {user.online && (
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: '#4CAF50',
                    display: 'inline-block',
                    marginRight: '4px'
                  }} />
                )}
                {user.online ? 'Онлайн' : '5 минут назад'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapScreenWeb; 