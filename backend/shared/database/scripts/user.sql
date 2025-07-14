CREATE TABLE public.users (
    id int4 NOT NULL,
    username varchar NOT NULL,
    email varchar NOT NULL,
    password varchar NOT NULL,
    mobile_number int8,
    country_id int4,
    region_id int4,
    city_id int4,
    created_at timestamp,
    updated_at timestamp,
    is_active bool
);

