const portConfig = { port: 7777 };

const todos = [];

const handleGetRoot = async (request) => {
    return new Response("Hello world at root!");
}

const handleGetTodos = async (request, urlPatternResult) => {
    return Response.json(todos);
}

const handlePostTodos = async (request) => {
    if (!request || request.method !== 'POST') {
        return new Response("failed", { status: 400 })
    }
    try {
        const todo = await request.json();

        if (!todo || typeof todo !== 'object') {
            return new Response("Invalid data", { status: 400 });
        }
        todos.push(todo);
        return new Response("OK", { status: 200 });
    } catch (error) {
        return new Response("Invalid JSON", { status: 400 });
    }
}

const urlMapping = [
    {
        method: "GET",
        pattern: new URLPattern({ pathname: "/" }),
        fn: handleGetRoot
    },
    {
        method: "GET",
        pattern: new URLPattern({ pathname: "/todos" }),
        fn: handleGetTodos
    },
    {
        method: "POST",
        pattern: new URLPattern({ pathname: "/todos" }),
        fn: handlePostTodos
    }
]

const handleRequest = async (request) => {
    const mapping = urlMapping.find(
        (um) => um.method === request.method && um.pattern.test(request.url)
    );

    if (!mapping) {
        return new Response("Not found", { status: 404 })
    }

    const mappingResult = mapping.pattern.exec(request.url);
    return await mapping.fn(request, mappingResult)
};

const handleHttpConnecition = async (conn) => {
    for await (const requestEvent of Deno.serveHttp(conn)) {
        requestEvent.respondWith(await handleRequest(requestEvent.request));
    }
}

for await (const conn of Deno.listen(portConfig)) {
    handleHttpConnecition(conn);
}


// Deno.serve({ port: 7777 }, handleRequest)