const express=require('express')
var app = express();
app.use(express.json());
app.listen(3000,(err,data)=>{
    if(err){
        console.log('Some issues')
    }
    else{
        console.log('Server is up and Running')
    }
})
//Tasks APis to create,get,update and search with the 3 fields id,title and description and courseIndicator

/*......
DataSource: array
........*/
const taskLists = [
    {
        id: 1,
        title: "Create a new project",
        description: "Create a new project using Magic",
        completed: false
    },
    {
        id: 2,
        title: "Timeout to learn yourself",
        description: "Timeout to study apart from work schedule",
        completed: false
    },
    {
        id: 3,
        title: "Drink water",
        description: "1 liter per 3 hours",
        completed: false
    }
];

/* ...........
api:home
method: get
resource: Info
*/

var welcomeMessage="Welcome to Task Management Which includes, creating, getting, updating and searching tasks"
app.get('/home',(req,res)=>{
      res.status(200).send("Welcome t Task Management API")
});

/* ...........
api:getTasks
method: get
resource: tasks
*/

app.get('/tasks', (req,res)=>{
    res.status(200).send(taskLists)
});

/* ...........
api:getTasks
method: get
resource: tasks
params: Task Id
*/
app.get('/tasks/:id',(req,res)=>{
    var taskId= parseInt(req.params.id);
    const taskInfo = taskLists.find(task => task.id === taskId);
    if(taskInfo){
        res.status(200).send(taskInfo);
    }else {         
        res.status(404).send( {"message":"Task not found"} )        
    }  
});

/* ...........
api:createTask
method: POST
resource: /tasks
*/
app.post("/tasks",(req,res)=> {
     let newTask = req.body;
     if(!newTask.title || !newTask.description || !newTask.completed){
       return res.status(400).json({"error": "Missing parameters either title or description"})
     }
     else{
        let newId=taskLists.length+1;
        taskLists.push({'id':newId,'title':newTask.title,"description":newTask.description,"completed":newTask.completed})
        return res.status(201).json({...newTask, id:newId}).end();
     }
    });

/* ...........
api:DeleteTaskBy Id
method: POST
resource: /tasks
params: Task Id
*/  
app.delete( '/tasks/:id', (req,res)=>{
    var originalSize=taskLists.length
    var objWithIdIndex=parseInt(req.params.id)
    taskLists.splice(objWithIdIndex, 1);
    console.log(taskLists.length)
    console.log(originalSize.length)
    if(originalSize>taskLists.length) {
            res.send(204).send( {'message': 'Deleted Successfully'} );
            taskLists.forEach((object,index)=>{
                object.id=index+1;
            })
    } else {
            res.status(404).send( {'message':'No such Task exists'} ).end()
    }
    });
/* ...........
api:DeleteTaskBy Id
method: POST
resource: /tasks
params: Task Id
*/  
