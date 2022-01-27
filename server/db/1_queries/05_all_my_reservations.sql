SELECT reservations.id, properties.title, properties.cost_per_night, reservations.start_date, AVG(property_reviews.rating) as average_rating
FROM reservations
  JOIN properties ON properties.id = reservations.property_id
  JOIN property_reviews on property_reviews.property_id = properties.id
WHERE reservations.guest_id=9
GROUP BY reservations.id, properties.id
ORDER BY reservations.start_date
LIMIT 10;
