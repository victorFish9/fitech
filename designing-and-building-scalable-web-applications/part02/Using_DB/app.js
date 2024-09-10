const portConfig = { port: 7777 };
import postgres from 'https://deno.land/x/postgresjs@v3.4.4/mod.js'


const sql = postgres({});

const handleGetRoot = async (request) => {
    return new Response("Hello world at root!");
};

const handleGetItem = async (request, urlPatternResult) => {
    const id = urlPatternResult.pathname.groups.id;
    const items = await sql`SELECT * FROM items WHERE id = ${id}`;

    return Response.json(items[0]);
}

const handleGetItems = async (request) => {
    const items = await sql`SELECT * FROM items`;
    return Response.json(items);
};

const handlePostItems = async (request) => {
    const item = await request.json();

    await sql`INSERT INTO items (name) VALUES (${item.name})`;
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
    return await mapping.fn(request, mappingResult)
}

const handleHttpConnecition = async (conn) => {
    for await (const requestEvent of Deno.serveHttp(conn)) {
        requestEvent.respondWith(await handleRequest(requestEvent.request));
    }
}

for await (const conn of Deno.listen(portConfig)) {
    handleHttpConnecition(conn);
}

/*
https://fitech101.aalto.fi/designing-and-building-scalable-web-applications/dab-02-web-software-development-rehearsal/2-web-applications-with-deno/
*/
