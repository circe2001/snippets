# 数据库提取字段中的行政区名称并对应转换为省级名称

## 1 问题背景

仿照国家法律法规数据库网站，并实现同样的高级检索功能。

网站地址：https://flk.npc.gov.cn/

爬取数据后，得到一张fagui表，用以存储所有的法律法规，其中有一个字段office，是国家及省市县级法规制定机关的名称。在官方网站中，高级检索选项中的制定机关一项涉及到地方人大及常委会按省份分类搜索，如下图。

但是网站爬取得到的数据中，没有法律法规的省份信息字段，无法直接获取到地方法律法规的省份信息。观察发现，在office字段，省市县级单位名称均以行政区名称开头，可以根据office字段信息提取出省份信息，并作为province字段方便数据库查询。

数据库环境：postgreSQL、Navicat Premium 16

![image-20250427084344791](D:\official\gzgd\法律法规检索\数据库操作\根据office字段生成province字段.assets\image-20250427084344791.png)

## 2 解决思路

除开国家级的制定机关，地方的制定机关名称均为行政区域名称开头，可以据此提取到地方机关的所属省份信息。但是office字段中包含的行政区域名称可能只有市级或者县级，因此还需要对应到省级行政区名称。

关键步骤：

1. 通过正则表达式匹配提取出office字段中的行政区名称
2. 省市县三级行政区均映射到省级
3. 更新province字段信息

上述步骤均考虑通过sql语句实现，不涉及后端代码。

## 3 实际解决

### 3.1 正则匹配提取行政区名称

根据数据发现，除国家级机关外，其余机关名称中的行政区部分只会以省、市、自治区、自治州、自治县、自治旗结尾。

因此正则表达式如下：

```
([\u4e00-\u9fa5]+(?:省|市|自治区|自治州|自治县|自治旗))
```

[\u4e00-\u9fa5]表达任意汉字字符

可以验证：

![image-20250425165427484](D:\official\gzgd\法律法规检索\数据库操作\根据office字段生成province字段.assets\image-20250425165427484.png)

实际操作中，office字段中国家级机关对应的province字段值为NULL。

### 3.2 省市县行政区三级映射

引入一个包含省市县行政区三级映射关系的region表，表结构如下：

```sql
-- 创建枚举类型
CREATE TYPE status_enum AS ENUM ('0', '1');

-- 创建表
CREATE TABLE public.region (
  id VARCHAR(40) PRIMARY KEY,               -- 主键
  name VARCHAR(40),                         -- 省市区名称
  parentid VARCHAR(40),                     -- 上级ID
  shortname VARCHAR(40),                    -- 简称
  leveltype INT,                            -- 级别: 0-中国；1-省；2-市；3-区县
  citycode VARCHAR(7),                      -- 城市代码
  zipcode VARCHAR(6),                       -- 邮编（中国邮编为6位）
  lng DECIMAL(9,6),                         -- 经度（数值类型，保留6位小数）
  lat DECIMAL(8,6),                         -- 纬度（数值类型，保留6位小数）
  pinyin VARCHAR(40),                       -- 拼音
  status status_enum DEFAULT '1'            -- 状态（使用枚举类型）
);
```

完整region表的创建和数据插入可见：

解决映射问题的关键字段为id、name、parentid、leveltype，在region表中通过匹配name找到行政区对应的记录，得到parentid、leveltype信息。

首先判断leveltype的值是否为1（省级），是则当前name值即为fagui表的province值；否则根据parentid值查找上级行政区域，直至leveltype的值为1。显然，此处涉及到一个递归查询，递归出口即为`leveltype = 1`。

因此可以创建一个Function：

```sql
-- get_province.sql
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
```

### 3.3 更新province字段数据

```sql
UPDATE fagui
SET province = get_province(
    SUBSTRING(office FROM '([\u4e00-\u9fa5]+(?:省|市|自治区|自治州|自治县|自治旗))')
)
WHERE office ~ '[\u4e00-\u9fa5]+(?:省|市|自治区|自治州|自治县|自治旗)';
```

结果如下：

![image-20250425172354497](D:\official\gzgd\法律法规检索\数据库操作\根据office字段生成province字段.assets\image-20250425172354497.png)

## 4 一些bug

![image-20250425172601266](D:\official\gzgd\法律法规检索\数据库操作\根据office字段生成province字段.assets\image-20250425172601266.png)

检查province字段为空的数据，即提取省份信息失败的记录，发现国家级机关对应的province值均为NUll，这是符合预期的，但仍有几个县级机关没有成功得到对应的省份名称。

分析失败原因：

1. “积石山保安族东乡族撒拉族治县人民代表大会”中的“自治县”缺失“自”，导致正则匹配失败。
2. “云南省文山壮族苗族自治州人民代表大会”的正则匹配结果为“云南省文山壮族苗族自治州”，既不是“云南省”也不是“文山壮族苗族自治州”，故无法在region表中对应到记录。
3. “双江拉祜族佤族布朗族傣族常委会”的行政区名称应为“双江拉祜族佤族布朗族傣族自治县”，“自治县”三个字被省略，故无法在region表中对应到记录。
4. “寻甸回族彝族自治县人民代表大会”可以正确匹配得出行政区名称“寻甸回族彝族自治县”，且排除region表信息错误缺失的可能，如下图。但在调用get_province却只能得到NULL值，具体原因不明。

正则匹配正常：

![image-20250425174251072](D:\official\gzgd\法律法规检索\数据库操作\根据office字段生成province字段.assets\image-20250425174251072.png)

region表信息正常：

![image-20250425174610738](D:\official\gzgd\法律法规检索\数据库操作\根据office字段生成province字段.assets\image-20250425174610738.png)

综上，数据信息本身的不规范和错误解决起来有点麻烦，可能可以考虑在对应到region表中的name时使用模糊匹配，不知道能不能实现。不过好在失败数据占比0.5%不到，那就手动解决好了！
