cd run
docker-compose -f docker-compose.local.yml up
npm run seed
npm run start
localhost:3000/api