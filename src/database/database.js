const { PGDATABASE_URI, PGDATABASE_URI_TEST, PGDATABASE_URI_DEV, NODE_ENV } = process.env
const connectionString = NODE_ENV === 'test' ? PGDATABASE_URI_TEST : (NODE_ENV === 'development' ? PGDATABASE_URI_DEV : PGDATABASE_URI)
module.exports = connectionString
