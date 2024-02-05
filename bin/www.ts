const app = require('../app')

const server = app.listen(5000,() => {
    console.log(`
        ##############################################
        🛡️      Server listening on port : 5000     🛡️
        ##############################################
    `)
}).on("error",(err: any) => {
    console.error(err);
    process.exit(1);
});

server.timeout = 1000000;