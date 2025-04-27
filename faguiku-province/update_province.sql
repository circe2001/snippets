-- SELECT 
--   office,
--   SUBSTRING(office FROM '([\u4e00-\u9fa5]+(省|市|自治区|自治州|自治县|自治旗))') AS region
-- FROM fagui
-- WHERE office ~ '[\u4e00-\u9fa5]+(省|市|区|县|自治州|自治县|自治旗)';

-- ALTER TABLE fagui ADD COLUMN province varchar;

UPDATE fagui
SET province = get_province(
    SUBSTRING(office FROM '([\u4e00-\u9fa5]+(?:省|市|自治区|自治州|自治县|自治旗))')
)
WHERE office ~ '[\u4e00-\u9fa5]+(?:省|市|自治区|自治州|自治县|自治旗)';