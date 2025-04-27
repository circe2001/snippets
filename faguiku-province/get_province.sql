CREATE FUNCTION get_province(p_name VARCHAR)
RETURNS VARCHAR AS $$ 
DECLARE province_name VARCHAR; 
BEGIN     
WITH RECURSIVE cte AS (         
    SELECT id, name, parentid, leveltype         
    FROM region         
    WHERE name = p_name  -- 使用输入参数作为起点         
    UNION ALL         
    SELECT c.id, c.name, c.parentid, c.leveltype         
    FROM region c         
    INNER JOIN cte ON c.id = cte.parentid         
    WHERE cte.leveltype != 1  -- 未找到省级时继续递归     
)     
SELECT name INTO province_name FROM cte WHERE leveltype = 1  -- 最终筛选省级名称     
LIMIT 1;      
RETURN province_name; 
END; 
$$ LANGUAGE plpgsql STABLE;