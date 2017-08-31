export const RamCpuSqlQuery = `
	with minutes as (
	SELECT
	TIMESTAMP_SUB(TIMESTAMP_TRUNC(CURRENT_TIMESTAMP(), MINUTE), INTERVAL num MINUTE) AS minute
	FROM UNNEST(GENERATE_ARRAY(0, 30)) AS num ORDER BY num
	), perf as (
	select
	TIMESTAMP_TRUNC(date, MINUTE) as minute,
	category, counter, instance,
	cast(avg(value) as int64) as value
	from \`majestic-cairn-171208\`.dev.perfmon where (_PARTITIONTIME IS NULL OR _PARTITIONTIME = TIMESTAMP(CURRENT_DATE()))
	AND date >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 MINUTE)
	and servername = 'DRUM'
	group by minute, 
	category, counter, instance
	)
	select m.minute,
	IFNULL(ram.value, 0) as ram,
	IFNULL(cpu.value, 0) as cpu
	from minutes m
	left join perf ram on ram.minute = m.minute and ram.category = 'Memory' and ram.counter = 'Available MBytes'
	left join perf cpu on cpu.minute = m.minute and cpu.category = 'Processor' and cpu.counter = '% Processor Time' and cpu.instance = '_Total'
	order by minute desc
`