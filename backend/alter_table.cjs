const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_PS1Crclw7Xpy@ep-patient-cloud-aiznb5ds.c-4.us-east-1.aws.neon.tech:5432/neondb?sslmode=require'
});

async function run() {
  await client.connect();
  try {
    await client.query('ALTER TABLE products ALTER COLUMN image_url TYPE TEXT;');
    console.log('Altered table successfully');
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
