const express = require('express');
const app = express();
app.get('/', (req,res)=>{
    res.send("express server is running");
});
app.get('/health', (req,res)=>{
    res.json({status: "ok", server: "running"});
});
const PORT =5000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});