INSERT INTO users (name, email, password)
VALUES ('Olly', 'olly@sk.8', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Danger', 'dang@er.ous', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Potato', 'cat@mo.use', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
VALUES (1, 'Mansion', 'Like a house but big', 'fake.url', 'fake.url', '5000', 4, 4, 6, 'Canada', 'street street', 'city city', 'BC', 'H0H0H0'),
(1, 'House', 'Like a house', 'fake.url', 'fake.url', '500', 2, 3, 4, 'Canada', 'street way', 'town city', 'ON', 'L0P1H0'),
(3, 'Cat Tree', 'Cat sized residence', 'fake.url', 'fake.url', '5', 0, 1, 1, 'Canada', 'tree', 'cat city', 'ON', 'C4TD0G');

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2020-12-25', '2021-01-01', 1, 3),
('2020-12-25', '2021-01-02', 3, 1),
('2020-12-25', '2021-01-03', 2, 2);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (3, 1, 1, 5, 'smashing'),
(2, 2, 3, 4, 'cool'),
(1, 3, 2, 5, 'cozy');