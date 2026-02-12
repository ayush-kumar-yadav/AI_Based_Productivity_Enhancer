const fs = require("fs"); //require("fs") loads Node’s built-in File System module
const tasks =[
    {id: 1, title: "learn js", completed: true},
    {id: 2, title: "learn node", completed: false},
];
fs.writeFileSync("tasks.json", JSON.stringify(tasks, null, 2)); //This converts JavaScript → JSON text

// fs.writeFileSync("tasks.json", DATA) => Creates a file called tasks.json
//If it exists → overwrites it ,Writes data synchronously

console.log("Tasks saved to file");

function addtask(title){
    const data = fs.readFileSync("tasks.json", "utf-8"); //Reads the file tasks.json synchronously
    const tasks = JSON.parse(data); //Converts JSON text → JavaScript
    tasks.push({
        id: tasks.length + 1,
        title,
        completed: false
    });
    fs.writeFileSync("tasks.json", JSON.stringify(tasks, null, 2)); //Writes updated tasks back to file
}
addtask("learn express");
addtask("learn react");






