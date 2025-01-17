/*
 * @Author: <Tin Tran> (tin.tran@abcdigital.io)
 * @Created: 2025-01-17 14:26:39
 */

import { useContext } from 'react';

import { PostContext } from '../contexts/posts.context';

export const usePosts = () => {
  const context = useContext(PostContext);

  if (context === undefined) {
    throw new Error('usePosts must be used within a PostProvider');
  }

  return context;
};
