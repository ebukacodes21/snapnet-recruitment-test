start:
	npx sequelize-cli init
table: 
	npx sequelize-cli migration:generate --name=${name}
composeup:
	docker compose up -d
composedown:
	docker compose down -v