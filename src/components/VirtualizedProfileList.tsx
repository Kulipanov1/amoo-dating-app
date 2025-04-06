import React, { useCallback, useMemo } from 'react';
import { Box, CircularProgress, useTheme, useMediaQuery, Typography } from '@mui/material';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import ProfileCard from './ProfileCard';
import ProfileListService from '../services/ProfileListService';
import { UserProfile } from '../services/UserProfileService';
import { useOptimizedDataLoading } from '../hooks/useOptimizedDataLoading';

const VirtualizedProfileList: React.FC = () => {
  const profileService = ProfileListService.getInstance();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const {
    data: profiles,
    loading,
    loadMore,
    hasMore
  } = useOptimizedDataLoading<UserProfile>({
    initialData: [],
    loadMore: async () => {
      const newProfiles = await profileService.loadMoreProfiles();
      return newProfiles;
    },
    hasMore: profileService.hasMoreProfiles()
  });

  const getColumnCount = useCallback(() => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 4;
  }, [isMobile, isTablet]);

  const getRowHeight = useCallback(() => {
    if (isMobile) return 400;
    if (isTablet) return 350;
    return 300;
  }, [isMobile, isTablet]);

  const Cell = useCallback(({ columnIndex, rowIndex, style }: any) => {
    const index = rowIndex * getColumnCount() + columnIndex;
    if (index >= profiles.length) return null;

    // Загружаем следующую партию, когда пользователь приближается к концу списка
    if (index >= profiles.length - getColumnCount() * 2 && hasMore && !loading) {
      loadMore();
    }

    return (
      <div style={style}>
        <ProfileCard profile={profiles[index]} />
      </div>
    );
  }, [profiles, hasMore, loading, loadMore, getColumnCount]);

  const gridProps = useMemo(() => ({
    columnCount: getColumnCount(),
    columnWidth: 0, // Будет установлено AutoSizer
    height: 0, // Будет установлено AutoSizer
    rowCount: Math.ceil(profiles.length / getColumnCount()),
    rowHeight: getRowHeight(),
    width: 0 // Будет установлено AutoSizer
  }), [profiles.length, getColumnCount, getRowHeight]);

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', width: '100%' }}>
      <AutoSizer>
        {({ height, width }) => (
          <Grid
            {...gridProps}
            columnWidth={width / getColumnCount()}
            height={height}
            width={width}
          >
            {Cell}
          </Grid>
        )}
      </AutoSizer>
      {loading && (
        <Box sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: 'background.paper',
          p: 1,
          borderRadius: 1,
          boxShadow: 1
        }}>
          <CircularProgress size={20} />
          <Typography variant="body2">Загрузка...</Typography>
        </Box>
      )}
    </Box>
  );
};

export default VirtualizedProfileList; 