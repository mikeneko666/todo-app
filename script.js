const input = document.getElementById("taskInput");
const button = document.getElementById("addBtn");
const list = document.getElementById("taskList");

const filter = document.getElementById("filter");

// データ保存用
let tasks = [];

// ローカルストレージから読み込み
window.addEventListener("load", function () {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    tasks.forEach(task => renderTask(task));
  }
});

// タスク追加
const dueDateInput = document.getElementById("dueDate");
const priorityInput = document.getElementById("priority");

button.addEventListener("click", function () {
  const taskText = input.value;
  if (taskText === "") return;

  const task = {
    text: taskText,
    completed: false,
    dueDate: dueDateInput.value,
    priority: priorityInput.value
  };

  tasks.push(task);
  saveTasks();
  renderTask(task);

  input.value = "";
  dueDateInput.value = "";
});

// タスク描画
function renderTask(task) {
  const li = document.createElement("li");


  // テキスト
  const span = document.createElement("span");
  span.textContent = `${task.text}（期限: ${task.dueDate || "なし"} / 優先度: ${task.priority}）`;

  if (task.priority === "高") {
  span.classList.add("high");
} else if (task.priority === "中") {
  span.classList.add("medium");
} else {
  span.classList.add("low");
}

if (task.completed) {
  span.classList.add("completed");
}

  // チェックボックス
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;

  checkbox.addEventListener("change", function () {
    task.completed = checkbox.checked;

   if (task.completed) {
    span.classList.add("completed");
  } else {
    span.classList.remove("completed");
  }

    saveTasks();

    filter.dispatchEvent(new Event("change"));
  });

  // 削除ボタン
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "削除";

  deleteBtn.addEventListener("click", function () {
    tasks = tasks.filter(t => t !== task);
    saveTasks();
    li.remove();
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);

  list.appendChild(li);
}

// 保存処理
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

filter.addEventListener("change", function () {
  list.innerHTML = "";

  let filteredTasks = tasks;

  if (filter.value === "active") {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (filter.value === "completed") {
    filteredTasks = tasks.filter(t => t.completed);
  }

  filteredTasks.forEach(task => renderTask(task));
});