const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-task");
const addButton = document.getElementById("add-button");
const editButton = document.getElementById("edit-button");
const alertMessage = document.getElementById("alert-message");
const todosBody = document.querySelector("tbody");
const deleteAllButton = document.getElementById("delete-all-button");
const filterButtons = document.querySelectorAll(".filter-todos");

const e2p = (s) => s.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

let todos = JSON.parse(localStorage.getItem("todos")) || [];

// save to local storage
const saveToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

// creat id for todos
const generateId = () => {
  return Math.round(
    Math.random() * Math.random() * Math.pow(10, 15)
  ).toString();
};

// show alert message
const showAlert = (message, type) => {
  alertMessage.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerText = message;
  alert.classList.add("alert");
  alert.classList.add(`alert-${type}`);
  alertMessage.append(alert);

  setTimeout(() => {
    alert.style.display = "none";
  }, 2000);
};

// show todos
const displayTodos = (data) => {
  const todoList = data ? data : todos;
  todosBody.innerHTML = "";
  if (!todoList.length) {
    todosBody.innerHTML = "<tr><td colspan='4'>هیچ عنوانی یافت نشد!</td></tr>";
    return;
  }

  todoList.forEach((todo) => {
    todosBody.innerHTML += `
        <tr>
            <td>${todo.task}</td>
            <td>${e2p(todo.date) || "بدون تاریخ"}</td>
            <td>${todo.completed ? "تکمیل شده ✅" : "درحال انجام"}</td>
            <td>
                <button onclick="editHandler('${todo.id}')">ویرایش</button>
                <button onclick="toggleHandler('${todo.id}')">
                    ${todo.completed ? "قبل" : "بعد"}
                </button>
                <button onclick="deleteHandler('${todo.id}')">حذف</button>
            </td>
        </tr>`;
  });
};

// get todo values
const addHandler = () => {
  const task = taskInput.value;
  const date = dateInput.value;
  const todo = {
    id: generateId(),
    task,
    date,
    completed: false,
  };
  if (task) {
    todos.push(todo);
    saveToLocalStorage();
    displayTodos();
    taskInput.value = "";
    dateInput.value = "";
    showAlert("کار با موفقیت اضافه شد", "success");
  } else {
    showAlert("لطفا کار را وارد کنید!", "error");
  }
};

// delete all todos
const deleteAllHandler = () => {
  if (todos.length) {
    todos = [];
    saveToLocalStorage();
    displayTodos();
    showAlert("همه کار ها با موفقیت حذف گردید", "success");
  } else {
    showAlert("هیچ کاری برای حذف شدن وجود ندارد!", "error");
  }
};

// delete one todo
const deleteHandler = (id) => {
  const newTodos = todos.filter((todo) => todo.id !== id);
  todos = newTodos;
  saveToLocalStorage();
  displayTodos();
  showAlert("کار حذف  گردید", "success");
};

// changing the status of todos
const toggleHandler = (id) => {
  const newTodos = todos.map((todo) => {
    if (todo.id === id) {
      return {
        id: todo.id,
        task: todo.task,
        date: todo.date,
        completed: !todo.completed,
      };
    } else {
      return todo;
    }
  });
  todos = newTodos;
  saveToLocalStorage();
  displayTodos();
  showAlert("وضعیت کار تغییر گردید", "success");
};

// edit todos
const editHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  taskInput.value = todo.task;
  dateInput.value = todo.date;
  addButton.style.display = "none";
  editButton.style.display = "inline-block";
  editButton.dataset.id = id;
};

const applyEditHandler = (event) => {
  const id = event.target.dataset.id;
  const todo = todos.find((todo) => todo.id === id);
  todo.task = taskInput.value;
  todo.date = dateInput.value;
  taskInput.value = "";
  dateInput.value = "";
  addButton.style.display = "inline-block";
  editButton.style.display = "none";
  saveToLocalStorage();
  displayTodos();
  showAlert("کار با موفقیت ویرایش گردید", "success");
};

// filter todos
const filterHandler = (event) => {
  let filteredTodos = null;
  const filter = event.target.dataset.filter;

  switch (filter) {
    case "pending":
      filteredTodos = todos.filter((todo) => todo.completed === false);
      break;
    case "completed":
      filteredTodos = todos.filter((todo) => todo.completed === true);
      break;
    default:
      filteredTodos = todos;
      break;
  }

  displayTodos(filteredTodos);
};

window.addEventListener("load", () => displayTodos());
addButton.addEventListener("click", addHandler);

deleteAllButton.addEventListener("click", deleteAllHandler);
editButton.addEventListener("click", applyEditHandler);

filterButtons.forEach((button) => {
  button.addEventListener("click", filterHandler);
});
