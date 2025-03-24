import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

const ProfileScreenWeb = () => {
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

  return (
    <div style={{ 
      backgroundColor: '#f5f5f5',
      minHeight: '100%',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '12px',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <img
          src={userProfile.photos[0]}
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '60px',
            marginBottom: '15px',
            objectFit: 'cover'
          }}
          alt={userProfile.name}
        />
        <div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333',
            margin: '0 0 5px 0'
          }}>
            {userProfile.name}, {userProfile.age}
          </h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666'
          }}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <span style={{ marginLeft: '5px' }}>{userProfile.location}</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '15px',
          margin: '0 0 15px 0'
        }}>
          О себе
        </h3>
        <p style={{
          fontSize: '16px',
          color: '#666',
          lineHeight: '24px',
          margin: 0
        }}>
          {userProfile.bio}
        </p>
      </div>

      {/* Photos */}
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333',
          margin: '0 0 15px 0'
        }}>
          Фотографии
        </h3>
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '10px',
          padding: '5px'
        }}>
          {userProfile.photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '10px',
                objectFit: 'cover'
              }}
              alt={`Фото ${index + 1}`}
            />
          ))}
          <button style={{
            width: '100px',
            height: '100px',
            borderRadius: '10px',
            backgroundColor: '#f0f0f0',
            border: '2px dashed #8A2BE2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <Ionicons name="add" size={32} color="#8A2BE2" />
          </button>
        </div>
      </div>

      {/* Interests */}
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333',
          margin: '0 0 15px 0'
        }}>
          Интересы
        </h3>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {userProfile.interests.map((interest, index) => (
            <span
              key={index}
              style={{
                backgroundColor: '#f0f0f0',
                padding: '8px 15px',
                borderRadius: '20px',
                color: '#333',
                fontSize: '14px'
              }}
            >
              {interest}
            </span>
          ))}
          <button style={{
            width: '36px',
            height: '36px',
            borderRadius: '18px',
            backgroundColor: '#f0f0f0',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <Ionicons name="add" size={20} color="#8A2BE2" />
          </button>
        </div>
      </div>

      {/* Settings */}
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '12px'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333',
          margin: '0 0 15px 0'
        }}>
          Настройки
        </h3>
        {[
          { icon: 'person-outline', title: 'Редактировать профиль' },
          { icon: 'notifications-outline', title: 'Уведомления' },
          { icon: 'shield-outline', title: 'Конфиденциальность' },
          { icon: 'help-circle-outline', title: 'Помощь' },
          { icon: 'log-out-outline', title: 'Выйти' }
        ].map((item, index) => (
          <button
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '15px 0',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: index < 4 ? '1px solid #eee' : 'none',
              cursor: 'pointer'
            }}
          >
            <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={24} color="#666" />
            <span style={{
              flex: 1,
              fontSize: '16px',
              color: '#333',
              marginLeft: '15px',
              textAlign: 'left'
            }}>
              {item.title}
            </span>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileScreenWeb; 