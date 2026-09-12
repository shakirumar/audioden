const { Client } = require('pg');

const connectionString = 'postgresql://postgres:E8uza7L*ivCdMPY@db.cespmpxtawtyudwfrgai.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
});

async function disableRLS() {
  try {
    await client.connect();
    console.log('Connected to Supabase Postgres!');

    const tables = ['products', 'categories', 'brands', 'orders', 'customers', 'banners', 'reviews', 'offers'];
    
    for (const table of tables) {
      console.log(`Disabling RLS on ${table}...`);
      await client.query(`ALTER TABLE IF EXISTS ${table} DISABLE ROW LEVEL SECURITY;`);
      
      // Also drop any existing policies just to be clean, or just disabling is enough.
      console.log(`RLS disabled for ${table}.`);
    }

    console.log('Successfully disabled RLS on all tables!');
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

disableRLS();
