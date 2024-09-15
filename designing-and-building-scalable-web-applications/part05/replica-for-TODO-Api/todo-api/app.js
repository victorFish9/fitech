import { postgres } from './deps.js'


const sql = postgres({
    host: Deno.env.get("DB_HOST") || 'localhost',
    port: 5433,
    user: Deno.env.get("DB_USER") || 'postgres',
    password: Deno.env.get("DB_PASSWORD") || 'Fallout4',
    database: Deno.env.get("DB_NAME") || 'fitech'
});

// const sql = postgres({});


const handleGetTodo = async (request, urlPatternResult) => {
    const id = urlPatternResult.pathname.groups.id;
    const todos = await sql`SELECT * FROM todos WHERE id = ${id}`;

    return Response.json(todos[0]);
}

const handleGetTodos = async (request) => {
    const todos = await sql`SELECT * FROM todos`;
    return Response.json(todos);
};

const handlePostTodos = async (request) => {
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
        fn: handleGetTodo
    },
    {
        method: "POST",
        pattern: new URLPattern({ pathname: "/todos" }),
        fn: handlePostTodos,
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
