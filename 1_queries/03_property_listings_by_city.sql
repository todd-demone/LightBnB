SELECT properties.id, title, cost_per_night, AVG(rating) as average_rating
FROM properties
JOIN property_reviews on properties.id = property_id
WHERE city LIKE '%ancouv%'
GROUP BY properties.id
HAVING AVG(rating) >= 4
ORDER BY cost_per_night
LIMIT 10;