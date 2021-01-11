SELECT tracks.id id,
  COUNT(DISTINCT likes.id) likes_count,
  COUNT(DISTINCT plays.id) play_count
FROM tracks 
LEFT OUTER JOIN likes ON (tracks.id = likes.track_id)
LEFT OUTER JOIN plays ON (tracks.id = plays.track_id)
GROUP BY tracks.id;