# alicia_news

Hi, welcome to my repo. I built an api with the purpose of accessing application data. The intention is to mimic a real world api using node, express and jest for testing. 

## Installation

```
git clone https://github.com/AliciaSarah92/alicia_news
cd alicia_news 
```
The package manager I used was npm
```
npm install
```

If you want to clone this repo, you will not have access to the environment variables. 

You will need to create two .env files:  
```
.env.test and .env.development
```

Into each of the files, please add 
```
PGDATABASE=
```
with the correct database name for that environment (see /db/setup.sql for the database names).

## Database, Seeding & Testing

```
# database
npm run setup-dbs

# seeding
npm run seed

# testing
npm run test
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)