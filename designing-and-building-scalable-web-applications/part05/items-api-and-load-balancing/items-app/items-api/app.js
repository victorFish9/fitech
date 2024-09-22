import { postgres } from './deps.js'


const sql = postgres({
    host: Deno.env.get("DB_HOST") || 'localhost',
    port: 5433,
    user: Deno.env.get("DB_USER") || 'postgres',
    password: Deno.env.get("DB_PASSWORD") || 'Fallout4',
    database: Deno.env.get("DB_NAME") || 'fitech'
});

// const sql = postgres({});

const SERVER_ID = crypto.randomUUID();

const handleGetRoot = async (request) => {
    return new Response(`Hello world from ${SERVER_ID}!`);
};

const handleGetItem = async (request, urlPatternResult) => {
    const id = urlPatternResult.pathname.groups.id;
    const items = await sql`SELECT * FROM todos WHERE id = ${id}`;

    return Response.json(items[0]);
}

const handleGetItems = async (request) => {
    const items = await sql`SELECT * FROM todos`;
    return Response.json(items);
};

const handlePostItems = async (request) => {
    const item = await request.json();

    await sql`INSERT INTO todos (name) VALUES (${item.name})`;
    return new Response("OK", { status: 200 });
}

const urlMapping = [
    {
        method: "GET",
        pattern: new URLPattern({ pathname: "/" }),
        fn: handleGetRoot,
    },
    {
        method: "GET",
        pattern: new URLPattern({ pathname: "/items" }),
        fn: handleGetItems,
    },
    {
        method: "GET",
        pattern: new URLPattern({ pathname: "/items/:id" }),
        fn: handleGetItem
    },
    {
        method: "POST",
        pattern: new URLPattern({ pathname: "/items" }),
        fn: handlePostItems,
    }
]

const handleRequest = async (request) => {
    const mapping = urlMapping.find(
        (um) => um.method === request.method && um.pattern.test(request.url)
    )

    if (!mapping) {
        return new Response("Not found", { status: 404 })
    }

    const mappingResult = mapping.pattern.exec(request.url);
    try {
        return await mapping.fn(request, mappingResult)
    } catch (e) {
        console.log(e);
        return new Response(e.stack, { status: 500 });
    }
}

const portConfig = { port: 7777, hostname: '0.0.0.0' };
Deno.serve(portConfig, handleRequest);

/*
https://fitech101.aalto.fi/designing-and-building-scalable-web-applications/dab-02-web-software-development-rehearsal/2-web-applications-with-deno/
*/
