import React, { useState } from 'react';
import TinderCard from 'react-tinder-card';
import { Box, Typography, Card, CardContent, CardMedia } from '@mui/material';

interface Profile {
  id: string;
  name: string;
  age: number;
  image: string;
  bio: string;
}

type Direction = 'left' | 'right' | 'up' | 'down';

const SwipeScreen: React.FC = () => {
  const [profiles] = useState<Profile[]>([
    {
      id: '1',
      name: 'Alice',
      age: 25,
      image: 'https://via.placeholder.com/300',
      bio: 'Love traveling and photography'
    },
    {
      id: '2',
      name: 'Bob',
      age: 28,
      image: 'https://via.placeholder.com/300',
      bio: 'Coffee enthusiast'
    }
  ]);

  const onSwipe = (direction: Direction, profile: Profile) => {
    console.log('You swiped ' + direction + ' on ' + profile.name);
  };

  return (
    <Box sx={{ 
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      bgcolor: 'background.default'
    }}>
      <Box sx={{ position: 'relative', height: 500, width: 300 }}>
        {profiles.map((profile) => (
          <TinderCard
            key={profile.id}
            onSwipe={(dir: Direction) => onSwipe(dir, profile)}
            preventSwipe={['up', 'down']}
          >
            <Card sx={{ 
              position: 'absolute',
              width: 300,
              height: 500,
              borderRadius: 2,
              boxShadow: 3
            }}>
              <CardMedia
                component="img"
                height="300"
                image={profile.image}
                alt={profile.name}
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  {profile.name}, {profile.age}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {profile.bio}
                </Typography>
              </CardContent>
            </Card>
          </TinderCard>
        ))}
      </Box>
    </Box>
  );
};

export default SwipeScreen; 