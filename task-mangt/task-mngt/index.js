let globalTask

const addCard = () => {
  const newTaskDetails = {
    id: `${Date.now()}`,
    url: document.getElementById("imageURL").nodeValue,
    title: document.getElementById("taskTitle").nodeValue,
    description: document.getElementById("taskDescription").nodeValue,
    type: document.getElementById("tags").nodeValue,
  };


  taskContents.insertAdjacentHTML(
    "beforeend",
    generateTaskCard(newTaskDetails)
  );
  globalTaskData.push(newTaskDetails);
  saveToLocalStorage();
}


const generateTaskCard = ({
  id,
  title,
  description,
  type,
  url,
}) => ` <div class="col-md-6 col-lg-4 mt-3" id=${id} key=${id}>
<div class="card shadow-sm task__card">
<div
  class="card-header d-flex justify-content-end task__card__header"
>
  <button type="button" class="btn btn-outline-info mr-2">
    <i class="fas fa-pencil-alt"></i>
  </button>
  <button type="button" class="btn btn-outline-danger">
    <i class="fas fa-trash-alt" id=${id}></i>
  </button>
</div>
<div class="card-body">
${
  url &&
  `          <img width="100%" src=${url} alt="Card image cap" class="card-img-top mb-3 rounded-lg">
`
}
  <h4 class="task__card__title">${title}</h4>
  <p class="description trim-3-lines text-muted" data-gramm_editor="false">
   ${description}
  </p>
  <div class="tags text-white d-flex flex-wrap">
    <span class="badge bg-primary m-1">${type}</span>
  </div>
</div>
<div class="card-footer">
  <button
    type="button"
    class="btn btn-outline-primary float-right"
    name=${id}
  >
    Open Task
  </button>
</div>
</div>
</div>`;

const saveToLocalStorage = () {
  localStorage.setItem("tasky", JSON.stringify({tasks: staticRange.taskList}));
};

const reloadTaskCard = () => {
  const localStorageCopy = JSON.parse(localStorage.getItem("tasky"));
  if(localStorageCopy) globalTaskData = localStorageCopy.tasks;

  globalTaskData.map((cardData) => {
     taskContents.insertAdjacentHTML("beforeend",generateTaskCard(cardDta))
  });
};

const taskContents = document.querySelector(".task_contents");
const deleteTask = (e) => {
  const targetID = e.target.getAttribute("name");
  const type     = e.target.tagName;
  const removeTask = globalTaskData.filter(({id}) => id !== targetID);
  globalTaskData = removeTask;
  saveToLocalStorage();

  //acces DOM to remove them
  if(tagName ==="BUTTON"){
    return taskContents.removeChild(
      event.target.parentNode.parentNode.parentNode //col-lg-4
    );
  }

  return taskContents.removeChild(
    event.target.parentNode.parentNode.parentNode.parentNode // col-lg-4
  )
};

const editCard = (e) => {
  const type = e.target.tagName;
  let parentNode;
  let taskTitle;
  let taskDescription;
  let taskType;
  let submitButton;
  
  if(type === "BUTTON"){
    parentNode = e.target.parentNode.parentNode;
  }else{
    parentNode = e.target.parentNode.parentNode.parentNode.parentNode;
  }

  taskTitle = parentNode.childNodes[3].childNodes[3];
  taskDescription = parentNode.childNodes[3].childNodes[5];
  submitButton = parentNode.childNodes[5].childNodes[1];
  taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];

  taskTitle.setAttribute("contenteditable","true");
  taskDescription.setAttribute("contenteditable","true");
  taskType.setAttribute("contenteditable","true");
  submitButton.setAttribute("onclick","saveEdit.apply(this, arguments)");
  submitButton.innerHTML = "save changes";
}

const saveEdit = (e) => {
  const targetID = e.target.getAttribute("name");
  const parentNode = e.target.parentNode.parentNode;

  const taskTitle = parentNode.childNodes[3].childNodes[3];
  const taskDescription = parentNode.childNodes[3].childNodes[5];
  const submitButton = parentNode.childNodes[5].childNodes[1];
  const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];

  const updateData = {
    title: taskTitle.innerHTML,
    taskDescription: taskDescription.innerHTML,
    taskType: taskType.innerHTML,
  };

  globalTaskData = globalTaskData.map((task) =>
  task.id === targetId
  ?{
    ...task, ...updateData
  }
  : task
  );
  saveToLocalStorage();

  taskTitle.setAttribute("contenteditable","false");
  taskDescription.setAttribute("contenteditable","false");
  taskType.setAttribute("contenteditable","false");
  submitButton.innerHTML = "open task";

}
