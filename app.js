const express=require('express')
const app = express();
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
        title: "Set up environment",
        description: "Install Node.js, npm, and git",
        priority:"high",
        completed: true,
        creationDate:"2024-04-26T17:00:00.000Z"
    },
    {
        id: 2,
        title: "Timeout to learn yourself",
        description: "Timeout to study apart from work schedule",
        priority:"low",
        completed: false,
        creationDate:"2026-04-26T17:00:00.000Z"

    },
    {
        id: 3,
        title: "Drink water",
        description: "1 liter per 3 hours",
        priority:"low",
        completed: false,
        creationDate:"2022-04-26T17:00:00.000Z"

    }
    ,{
        id: 4,
        title: "Drink water",
        description: "1 liter per 3 hours",
        priority:"medium",
        completed: false,
        creationDate:"2021-04-26T17:00:00.000Z"

    },
    {
        id: 5,
        title: "Drink water",
        description: "1 liter per 3 hours",
        priority:"high",
        completed: false,
        creationDate:"2027-04-26T17:00:00.000Z"

    }
];

/* ...........
api:home
method: get
resource: Info
*/

var welcomeMessage="Welcome to Task Management Which includes, creating, getting, updating and searching tasks"
app.get('/home',(req,res)=>{
      res.status(200).send(welcomeMessage)
});


/* ...........
api:getTasks
method: get
resource: tasks
queryparams: sortBy=asc or desc
*/

app.get('/tasks', (req,res)=>{
    let sortBy=req.query.sortBy
    let completedStatus=req.query.completed
    const sortArray=[...taskLists]
    console.log(completedStatus)
    console.log(typeof completedStatus)
    if(sortBy){
        if(sortBy==='desc'){
            taskLists.sort(function(a, b)
            { 
                return new Date(b.creationDate) - new Date(a.creationDate) 
            });
           return res.status(200).send(taskLists)
         }
        else if(sortBy==='asc'){
            sortArray.sort(function(a, b) {
                return new Date(a.creationDate) - new Date(b.creationDate)
            });
            return res.status(200).send(sortArray)
            
         } 
         else{
            return res.status(200).send(taskLists)

        }

        }
    else if(completedStatus){
    console.log(completedStatus);
     if(completedStatus === "true"){
        var completedStatusTrue=taskLists.filter(task => task.completed == true);
        return res.status(200).send(completedStatusTrue)
    }
     else if(completedStatus=='false'){
        var completedStatusTrue=taskLists.filter(task => task.completed == false);
        return res.status(200).send(completedStatusTrue)
    }
    else{
        return res.send('Invalid query parameter for "completed"')
    }
  }

    else{
        return res.status(200).send(taskLists)
    }
});


/* ...........
api:sortByPriority
method: get
resource: tasks/priority
params: :level:low or high or medium
*/

app.get('/tasks/priority/:level',(req,res)=>{
    let priority=req.params.level
    if(priority){
        if(priority=='low'){
            var lowPriorityTasks=taskLists.filter((item)=> item.priority =='low')
            return res.status(200).send(lowPriorityTasks)
        }
       else if(priority=='medium'){
            var lowPriorityTasks=taskLists.filter((item)=> item.priority =='medium')
            return res.status(200).send(lowPriorityTasks)
        }
        else if(priority=='high'){
            var lowPriorityTasks=taskLists.filter((item)=> item.priority =='high')
            return res.status(200).send(lowPriorityTasks)
        }
        else{
            return res.status(200).send(taskLists)
        }
    }
})

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
     if(!newTask.title && !newTask.description && !newTask.completed){
        return res.status(400).json({"error": "Missing title or description or completed"})
       
      
     }
     else{
        if(typeof newTask.completed != "boolean"){
            return res.status(400).json({"error": "Bad Request"})
           }

        let newId=taskLists.length+1;
        const date = new Date();
        newTask.creationDate = date;
        taskLists.push({'id':newId,'title':newTask.title,"description":newTask.description,"completed":newTask.completed,"creationDate":newTask.creationDate})
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
            res.send(200).send( {'message': 'Deleted Successfully'} );
            taskLists.forEach((object,index)=>{
                object.id=index+1;
            })
    } else {
            res.status(404).send( {'message':'No such Task exists'} )
    }
    });


/* ...........
api:UpdateTask Id
method: PUT
resource: /tasks/Task Id
params: Task Id
body: title or description or completed or priority
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
            if (updatedTask.priority) {
                taskToUpdate.priority = updatedTask.priority;
            }
            return res.status(200).send({ 'message': 'Updated' });
        } else {
            return res.status(404).send({ 'message': 'Task not found' });
        }
    } else {
        return res.status(400).send({ 'message': 'Invalid data sent to update the task.' });
    }
});
module.exports = app;
