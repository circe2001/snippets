ALTER TABLE fagui 
ALTER COLUMN publish TYPE TIMESTAMP 
USING date_trunc('day', to_timestamp(publish, 'YYYY-MM-DD HH24:MI:SS'));

ALTER TABLE fagui 
ALTER COLUMN expiry TYPE TIMESTAMP
USING date_trunc('day', to_timestamp(expiry, 'YYYY-MM-DD HH24:MI:SS'));

UPDATE fagui 
SET publish = NULL 
WHERE publish = '0001-01-01 BC';

UPDATE fagui 
SET expiry = NULL 
WHERE expiry = '0001-01-01 BC';