-- Create 'employees' table
CREATE TABLE IF NOT EXISTS ecsplus.employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255)
);


CREATE TABLE IF NOT EXISTS ecsplus.users (
	id SERIAL PRIMARY KEY,
    changed_by varchar(150) NOT NULL,
	created_at timestamp without time zone NOT NULL,
	updated_at timestamp without time zone,
	name varchar(255) NOT NULL,
	surname varchar(255) NOT NULL,
	username varchar(255) NOT NULL,
    password varchar(255) NOT NULL

);

CREATE TABLE IF NOT EXISTS ecsplus.product_groups (
	id SERIAL PRIMARY KEY,
    changed_by varchar(150) NOT NULL,
	created_at timestamp without time zone NOT NULL,
	updated_at timestamp without time zone,
	name varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS ecsplus.products (
	id SERIAL PRIMARY KEY,
    changed_by varchar(150) NOT NULL,
	created_at timestamp without time zone NOT NULL,
	updated_at timestamp without time zone NULL,
	name varchar(255) NOT NULL,
	max_discount smallint NOT NULL,
	product_group_id int NULL
);