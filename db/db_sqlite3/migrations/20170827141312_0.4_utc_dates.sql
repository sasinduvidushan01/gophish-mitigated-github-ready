
-- +goose Up
-- SQL in section 'Up' is executed when this migration is applied
UPDATE campaigns SET created_date=STRFTIME('%Y-%m-%d %H:%M:%S+00:00', DATETIME(created_date, 'utc')) WHERE 1=1;
UPDATE campaigns SET completed_date=STRFTIME('%Y-%m-%d %H:%M:%S+00:00', DATETIME(completed_date, 'utc')) WHERE 1=1;
UPDATE campaigns SET launch_date=STRFTIME('%Y-%m-%d %H:%M:%S+00:00', DATETIME(launch_date, 'utc')) WHERE 1=1;
UPDATE events SET `time`=STRFTIME('%Y-%m-%d %H:%M:%S+00:00', DATETIME(`time`, 'utc')) WHERE 1=1;
UPDATE groups SET modified_date=STRFTIME('%Y-%m-%d %H:%M:%S+00:00', DATETIME(modified_date, 'utc')) WHERE 1=1;
UPDATE templates SET modified_date=STRFTIME('%Y-%m-%d %H:%M:%S+00:00', DATETIME(modified_date, 'utc')) WHERE 1=1;
UPDATE pages SET modified_date=STRFTIME('%Y-%m-%d %H:%M:%S+00:00', DATETIME(modified_date, 'utc')) WHERE 1=1;
UPDATE smtp SET modified_date=STRFTIME('%Y-%m-%d %H:%M:%S+00:00', DATETIME(modified_date, 'utc')) WHERE 1=1;

-- +goose Down
-- SQL section 'Down' is executed when this migration is rolled back

