const express = require('express');
const { build } = require("esbuild");



const app = express();

app.use('/', express.static('dist/'));

build({
    entryPoints : ['src/index.ts'],
    bundle: true,
    watch: true,
    outdir : 'dist'
})

app.listen(8080, ()=> {
    console.log('server started')
});

