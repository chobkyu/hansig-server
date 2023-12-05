const app = require('../app')

const server = app.listen(8080,() => {
    console.log(`
        ##############################################
        🛡️      Server listening on port : 8080     🛡️
        ##############################################
    `)
}).on("error",(err: any) => {
    console.error(err);
    process.exit(1);
});

server.timeout = 1000000;