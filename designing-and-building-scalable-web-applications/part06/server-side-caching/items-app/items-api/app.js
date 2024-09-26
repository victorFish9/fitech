import * as itemService from './services/itemService.js';

const SERVER_ID = crypto.randomUUID();

const handleGetRoot = async (request) => {
    return new Response(`Hello world from ${SERVER_ID}!`);
};

const handleGetItem = async (request, urlPatternResult) => {
    const id = urlPatternResult.pathname.groups.id;
    return Response.json(await itemService.getItem(id));
}

const handleGetItems = async (request) => {
    return Response.json(await itemService.getItems());
};

const handlePostItems = async (request) => {
    const item = await request.json();
    await itemService.addItem(item.name);
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
