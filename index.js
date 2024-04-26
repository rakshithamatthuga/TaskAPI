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
        priority:"high",
        completed: false
    },
    {
        id: 2,
        title: "Timeout to learn yourself",
        description: "Timeout to study apart from work schedule",
        priority:"low",
        completed: false
    },
    {
        id: 3,
        title: "Drink water",
        description: "1 liter per 3 hours",
        priority:"low",
        completed: false
    }
    ,{
        id: 4,
        title: "Drink water",
        description: "1 liter per 3 hours",
        priority:"medium",
        completed: false
    },
    {
        id: 5,
        title: "Drink water",
        description: "1 liter per 3 hours",
        priority:"high",
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
     if(!newTask.title || !newTask.description || !newTask.completed || !newTask.priority){
       if(typeof newTask.completed != "boolean"){
        return res.status(400).json({"error": "Missing title or description or completed"})
       }
      
     }
     else{
        if(typeof newTask.completed != "boolean"){
            return res.status(400).json({"error": "Bad Request"})
           }

        let newId=taskLists.length+1;
        const date = new Date();
        taskLists.push({'id':newId,'title':newTask.title,"description":newTask.description,"completed":newTask.completed,"createdDate":date})
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
api:UpdateTask Id
method: PUT
resource: /tasks/Task Id
params: Task Id
*/  
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const updatedTask = req.body;

    if (updatedTask) {
        let taskToUpdate = taskLists.find(task => task.id === taskId);
        if (taskToUpdate) {
            if (updatedTask.completed && typeof updatedTask.completed !='boolean') {
                res.status(400).send({'message':'Error! Only Boolean type supported'})
            }
            if (updatedTask.title) {
                taskToUpdate.title = updatedTask.title;
            }
            if (updatedTask.description) {
                taskToUpdate.description = updatedTask.description;
            }
            if (updatedTask.completed !== undefined && typeof updatedTask.completed === 'boolean') {
                taskToUpdate.completed = updatedTask.completed;
            }
            return res.status(200).send({ 'message': 'Updated' });
        } else {
            return res.status(404).send({ 'message': 'Task not found' });
        }
    } else {
        return res.status(400).send({ 'message': 'Invalid data sent to update the task.' });
    }
});
