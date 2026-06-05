
-- +goose Up
-- SQL in section 'Up' is executed when this migration is applied
UPDATE campaigns SET created_date=STRFTIME('%Y-%m-%d %H:%M:%S+00:00', DATETIME(created_date, 'utc')) WHERE 1=1; -- NOSONAR
UPDATE campaigns SET completed_date=STRFTIME('%Y-%m-%d %H:%M:%S+00:00', DATETIME(completed_date, 'utc')) WHERE 1=1; -- NOSONAR
UPDATE campaigns SET launch_date=STRFTIME('%Y-%m-%d %H:%M:%S+00:00', DATETIME(launch_date, 'utc')) WHERE 1=1; -- NOSONAR
UPDATE events SET `time`=STRFTIME('%Y-%m-%d %H:%M:%S+00:00', DATETIME(`time`, 'utc')) WHERE 1=1; -- NOSONAR
UPDATE groups SET modified_date=STRFTIME('%Y-%m-%d %H:%M:%S+00:00', DATETIME(modified_date, 'utc')) WHERE 1=1; -- NOSONAR
UPDATE templates SET modified_date=STRFTIME('%Y-%m-%d %H:%M:%S+00:00', DATETIME(modified_date, 'utc')) WHERE 1=1; -- NOSONAR
UPDATE pages SET modified_date=STRFTIME('%Y-%m-%d %H:%M:%S+00:00', DATETIME(modified_date, 'utc')) WHERE 1=1; -- NOSONAR
UPDATE smtp SET modified_date=STRFTIME('%Y-%m-%d %H:%M:%S+00:00', DATETIME(modified_date, 'utc')) WHERE 1=1; -- NOSONAR

-- +goose Down
-- SQL section 'Down' is executed when this migration is rolled back

