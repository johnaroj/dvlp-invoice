build:
	docker compose -f local.yml up --build -d --remove-orphans

up:
	docker compose -f local.yml up -d

down:
	docker compose -f local.yml down --volumes   

down-v:
	docker compose -f local.yml down -v

show-logs:
	docker compose -f local.yml logs 

show-logs-api:
	docker compose -f local.yml logs api

show-logs-client:
	docker compose -f local.yml logs client

user:
	docker run --rm dvlp-invoice-api whoami

volume:
	docker volume inspect dvlp-invoice_mongo-data