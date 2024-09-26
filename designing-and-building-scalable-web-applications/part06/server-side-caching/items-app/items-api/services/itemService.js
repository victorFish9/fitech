import { postgres } from '../deps.js';

const sql = postgres({
    host: Deno.env.get("DB_HOST") || 'dpg-crooosu8ii6s73beovd0-a.frankfurt-postgres.render.com',
    port: 5432,
    user: Deno.env.get("DB_USER") || 'fitech_items_user',
    password: Deno.env.get("DB_PASSWORD") || 'fEHscQw9s7pdL6ALtkiTrPoZMAdy9v0p',
    database: Deno.env.get("DB_NAME") || 'fitech_items',
    ssl: 'require'
});

const getItem = async (id) => {
    const items = await sql`SELECT * FROM items WHERE id = ${id}`;
    return items[0];
};

const getItems = async () => {
    return await sql`SELECT * FROM items`;
}

const addItem = async (name) => {
    await sql`INSERT INTO items (name) VALUES (${name})`;
};

export { getItem, getItems, addItem };