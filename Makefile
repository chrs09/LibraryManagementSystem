up:
	docker-compose up -d

down:
	docker-compose down

artisan:
	docker-compose exec app php artisan $(cmd)
composer:
	docker-compose exec app composer $(cmd)
npm:
	docker-compose exec app npm $(cmd)
yarn:
	docker-compose exec app yarn $(cmd)
migrate:
	docker-compose exec app php artisan migrate
seed:
	docker-compose exec app php artisan db:seed
test:
	docker-compose exec app php artisan test
logs:
	docker-compose logs -f
