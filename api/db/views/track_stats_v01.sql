SELECT tracks.id id,
  COUNT(DISTINCT likes.id) likes_count,
  COUNT(DISTINCT histories.id) listens_count
FROM tracks 
LEFT OUTER JOIN likes ON (tracks.id = likes.track_id)
LEFT OUTER JOIN histories ON (tracks.id = histories.track_id)
GROUP BY tracks.id;