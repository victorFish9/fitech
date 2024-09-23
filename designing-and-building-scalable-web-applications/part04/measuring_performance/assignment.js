const portConfig = { port: 7777 };

import postgres from "https://deno.land/x/postgresjs@v3.4.4/mod.js";

const sql = postgres({
    
});

const handleGetTodos = async (request) => {
    const todos = await sql`SELECT * FROM todos`;
    return Response.json(todos);
};

const handleGetTodo = async (request, urlPatternResult) => {
    try {
        const id = urlPatternResult.pathname.groups.id;

        const todos = await sql`SELECT * FROM todos WHERE id = ${id}`;

        if (todos.length === 0) {
            return new Response("Todo not found", { status: 404 });
        }

        return Response.json(todos[0]);
    } catch (error) {

        console.error("Here is error", error);
        return new Response("ID not found", { status: 404 });
    }
};

const handlePostTodo = async (request) => {
    try {
        const todo = await request.json();

        if (!todo.item || typeof todo.item !== 'string' || todo.item.trim() === "") {
            return new Response("Missing or empty 'item' field", { status: 400 });
        }

        await sql`INSERT INTO todos (item) VALUES (${todo.item})`;

        return new Response("Todo added successfully", { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", { status: 400 });
    }
}

const urlMapping = [
    {
        method: "GET",
        pattern: new URLPattern({ pathname: "/todos" }),
        fn: handleGetTodos,
    },
    {
        method: "GET",
        pattern: new URLPattern({ pathname: "/todos/:id" }),
        fn: handleGetTodo,
    },
    {
        method: "POST",
        pattern: new URLPattern({ pathname: "/todos" }),
        fn: handlePostTodo,
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
