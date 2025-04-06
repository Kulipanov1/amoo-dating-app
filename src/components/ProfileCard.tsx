import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip, Avatar, Skeleton } from '@mui/material';
import { UserProfile } from '../services/UserProfileService';
import ImageCacheService from '../services/ImageCacheService';

interface ProfileCardProps {
  profile: UserProfile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      if (!profile.photoURL) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const cachedUrl = await ImageCacheService.getInstance().getImage(profile.photoURL);
        setImageUrl(cachedUrl);
      } catch (error) {
        console.error('Error loading image:', error);
        setImageUrl(profile.photoURL);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [profile.photoURL]);

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'scale(1.02)',
      }
    }}>
      {isLoading ? (
        <Skeleton variant="rectangular" height={200} animation="wave" />
      ) : (
        <CardMedia
          component="img"
          height="200"
          image={imageUrl || '/default-avatar.png'}
          alt={profile.displayName || 'Пользователь'}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {profile.displayName || 'Пользователь'}
        </Typography>
        
        {profile.bio && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {profile.bio}
          </Typography>
        )}

        {profile.skills && profile.skills.length > 0 && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {profile.skills.slice(0, 3).map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                size="small"
                variant="outlined"
                sx={{ borderRadius: 1 }}
              />
            ))}
            {profile.skills.length > 3 && (
              <Chip
                label={`+${profile.skills.length - 3}`}
                size="small"
                variant="outlined"
                sx={{ borderRadius: 1 }}
              />
            )}
          </Box>
        )}

        {profile.location && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
            <Typography variant="body2" component="span">
              📍 {profile.location}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCard; 