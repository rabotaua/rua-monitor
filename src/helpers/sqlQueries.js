export const bigSqlQuery = `
	with minutes as (
	SELECT
	TIMESTAMP_SUB(TIMESTAMP_TRUNC(CURRENT_TIMESTAMP(), MINUTE), INTERVAL num MINUTE) AS minute
	FROM UNNEST(GENERATE_ARRAY(0, 30)) AS num ORDER BY num
	), perf as (
	select
	TIMESTAMP_TRUNC(date, MINUTE) as minute,
	category, counter, instance,
	round(avg(value), 2) as value
	from \`majestic-cairn-171208\`.data.perfmon where (_PARTITIONTIME IS NULL OR _PARTITIONTIME = TIMESTAMP(CURRENT_DATE()))
	AND date >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 MINUTE)
	and servername = 'DRUM'
	group by minute, 
	category, counter, instance
	)
	select m.minute,
	IFNULL(ram.value, 0) as ram,
	IFNULL(cpu.value, 0) as cpu,
	IFNULL(swap.value, 0) as swap,
	IFNULL(hddq.value, 0) as hdd_queue,
	round(IFNULL(esms.value, 0) / IFNULL(esms2.value, 1), 2) as elastic_avg_search,
	IFNULL(asprps.value, 0) as asp_rps,
	IFNULL(r1.value, 0) as redis_ops,
	IFNULL(r2.value, 0) as redis_ram,
	IFNULL(r3.value, 0) as redis_ram_fragmentation
	from minutes m
	left join perf ram on ram.minute = m.minute and ram.category = 'Memory' and ram.counter = 'Available MBytes'
	left join perf cpu on cpu.minute = m.minute and cpu.category = 'Processor' and cpu.counter = '% Processor Time' and cpu.instance = '_Total'
	left join perf swap on swap.minute = m.minute and swap.category = 'Paging File' and swap.counter = '% Usage' and swap.instance = '_Total'
	left join perf hddq on hddq.minute = m.minute and hddq.category = 'PhysicalDisk' and hddq.counter = 'Avg. Disk Queue Length' and hddq.instance = '_Total'
	left join perf esms on esms.minute = m.minute and esms.category = 'Elasticsearch' and esms.counter = '_all.total.search.query_time_in_millis' and esms.instance = '_stats'
	left join perf esms2 on esms2.minute = m.minute and esms2.category = 'Elasticsearch' and esms2.counter = '_all.total.search.query_total' and esms2.instance = '_stats'
	left join perf asprps on asprps.minute = m.minute and asprps.category = 'ASP.NET Apps v4.0.30319' and asprps.counter = 'Requests/Sec' and asprps.instance = '__Total__'
	left join perf r1 on r1.minute = m.minute and r1.category = 'Redis' and r1.counter = 'instantaneous_ops_per_sec'
	left join perf r2 on r2.minute = m.minute and r2.category = 'Redis' and r2.counter = 'used_memory'
	left join perf r3 on r3.minute = m.minute and r3.category = 'Redis' and r3.counter = 'mem_fragmentation_ratio'
	order by minute
`

export const jsErrorSqlQuery = `
	with minutes as (
	SELECT
	TIMESTAMP_SUB(TIMESTAMP_TRUNC(CURRENT_TIMESTAMP(), MINUTE), INTERVAL num MINUTE) AS minute
	FROM UNNEST(GENERATE_ARRAY(0, 30)) AS num ORDER BY num
	), ga as (
	select 
	TIMESTAMP_TRUNC(TIMESTAMP_SECONDS(timestamp), MINUTE) as minute,
	countif(type = 'pageview') as hits,
	countif(type = 'event' and eventInfo.eventCategory = 'js error') as js_errors
	from \`majestic-cairn-171208\`.bigdata.ga where page.hostname = 'rabota.ua' and (_PARTITIONTIME IS NULL OR _PARTITIONTIME = TIMESTAMP(CURRENT_DATE()))
	AND TIMESTAMP_SECONDS(timestamp) >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 MINUTE)
	group by minute
	)
	select m.minute,
	ga.hits,
	ga.js_errors
	from minutes m
	left join ga on ga.minute = m.minute
	order by minute asc
`