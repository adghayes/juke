SELECT tracks.id id,
  COUNT(DISTINCT likes.id) likes_count
FROM tracks 
LEFT OUTER JOIN likes ON (tracks.id = likes.track_id)
GROUP BY tracks.id;