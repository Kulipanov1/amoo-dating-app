import React, { useEffect, useState, useRef, useCallback } from 'react';
import ProfileListService from '../services/ProfileListService';
import { UserProfile } from '../services/UserProfileService';
import { Box, CircularProgress, Grid } from '@mui/material';
import ProfileCard from './ProfileCard';

const ProfileList: React.FC = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const profileService = ProfileListService.getInstance();

  const loadMoreProfiles = async () => {
    if (loading || !profileService.hasMoreProfiles()) return;
    
    setLoading(true);
    try {
      const newProfiles = await profileService.loadMoreProfiles();
      setProfiles(prev => [...prev, ...newProfiles]);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const lastProfileRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && profileService.hasMoreProfiles()) {
        loadMoreProfiles();
      }
    });

    if (node) observer.current.observe(node);
  }, [loading]);

  useEffect(() => {
    const loadInitialProfiles = async () => {
      setLoading(true);
      try {
        const initialProfiles = await profileService.loadInitialProfiles();
        setProfiles(initialProfiles);
      } catch (error) {
        console.error('Error loading initial profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialProfiles();

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {profiles.map((profile, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={profile.id}
            ref={index === profiles.length - 1 ? lastProfileRef : undefined}
          >
            <ProfileCard profile={profile} />
          </Grid>
        ))}
      </Grid>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default ProfileList; 