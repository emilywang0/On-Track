// Time and date on banner

let clock = () => {
  let date = new Date();
  let hrs = date.getHours();
  let mins = date.getMinutes();
  let secs = date.getSeconds();
  let period = "AM";
  if (hrs == 0) {
    hrs = 12;
  } else if (hrs >= 12) {
    hrs = hrs - 12;
    period = "PM";
  }
  hrs = hrs < 10 ? "0" + hrs : hrs;
  mins = mins < 10 ? "0" + mins : mins;
  secs = secs < 10 ? "0" + secs : secs;

  let time = `${hrs}:${mins}:${secs} ${period}`;
  document.getElementById("clock").innerText = time;
  setTimeout(clock, 1000);
};

clock();

//Make banner stay on top of page while scrolling
window.onscroll = function() {myFunction()};

var header = document.getElementById("myHeader");

var sticky = header.offsetTop;

function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

//Calendar section
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;

        const style = getComputedStyle(content)

        if (style.display === "block") {
            content.style.display = "none";
        }
        else {
            content.style.display = "block";
        }
    });
}

let todoItems = [
    [], 
    [],
    [],
    [],
    [],
    [],
    [], 
    [],
    [],
    [],
    [],
    [],
];

function addTodo(text, detail, color, dueDate, monthIndex) {
    const todo = {
        text,
        detail,
        color,
        dueDate,
        monthIndex,
        checked: false,
        id: Date.now(),
    };
    todoItems[monthIndex].push(todo);
    renderTodo(todo, monthIndex)
}

function renderTodo(todo, monthIndex) {
    const monthContainer = "container" + monthIndex
    const list = document.getElementById(monthContainer);
    const item = document.querySelector(`[data-key='${todo.id}']`);

    if (todo.deleted) {
        item.remove();
        if (todoItems.length === 0) list.innerHTML = '';
        localStorage.setItem('todoItems', JSON.stringify(todoItems));
        return
    }

    const isChecked = todo.checked ? 'done' : '';
    const node = document.createElement("div");

    node.setAttribute('class', `todo-item ${isChecked}`);
    node.setAttribute('data-key', todo.id);
    node.innerHTML = `
    <input id="${todo.id}" type="checkbox"/>
    <label for="${todo.id}" class="tick js-tick"></label>
    <span style = "font-weight:600;">${todo.text}</span>
    <button class="delete-todo js-delete-todo" style="float:right">x</button><br>
    <span style = "font-size:14px;">Date: ${todo.dueDate}</span>
    <br>
    <span style = "white-space: pre-wrap; font-size:14px">Details: ${todo.detail}</span></div>
    `;

    node.style.backgroundColor = todo.color;

    if (item) {
        list.replaceChild(node, item);
    } else {
        list.append(node);
        
    }
    localStorage.setItem('todoItems', JSON.stringify(todoItems));
}

const form = document.getElementById('addtask');

function convertDateToMonthIndex(dateString) {
    // "2020-12-30" => 11
    const monthString = dateString[5] + dateString[6]
    return parseInt(monthString) - 1
}

form.addEventListener('submit', event => {
    // prevent page refresh on form submission
    event.preventDefault();
    // select the text input
    const input = document.getElementById('tasktitle');
    const detail = document.getElementById('detail');
    const color = document.querySelector('input[name="color"]').value;
    const dueDate = document.getElementById('dueDate').value;
    const monthIndex = convertDateToMonthIndex(dueDate)
    // Get the value of the input and remove whitespace
    const text = input.value.trim();
    const description = detail.value;
    if (text !== '') {
        addTodo(text, description, color, dueDate, monthIndex);
        input.value = '';
        detail.value = '';
        color.value = '';
        input.focus();
    }
});

function toggleDone(stringMonth, key) {
    const monthIndex = convertMonthIndex(stringMonth)
    const index = todoItems[monthIndex].findIndex(item => item.id === Number(key));

    todoItems[monthIndex][index].checked = !todoItems[monthIndex][index].checked;
    renderTodo(todoItems[monthIndex][index], monthIndex)
}

const list = document.querySelector('.grid-container');

list.addEventListener('click', event => {
    if (event.target.classList.contains('js-tick')) {
        const itemKey = event.target.parentElement.dataset.key;
        const month = event.target.parentElement.parentElement.id
        toggleDone(month, itemKey);
    }
    if (event.target.classList.contains('js-delete-todo')) {
        const itemKey = event.target.parentElement.dataset.key;
        const month = event.target.parentElement.parentElement.id
        deleteTodo(month, itemKey);
    }
});

function convertMonthIndex(stringMonth) {
    const indexStr = stringMonth.replace("container", "")
    return parseInt(indexStr)
}

function deleteTodo(stringMonth, key) {
    const monthIndex = convertMonthIndex(stringMonth)
    const index = todoItems[monthIndex].findIndex(item => item.id === Number(key));
    const todo = {
        deleted: true,
        ...todoItems[monthIndex][index]
    }
    todoItems[monthIndex] = todoItems[monthIndex].filter(item => item.id !== Number(key));
    renderTodo(todo, monthIndex);
}

// Store user settings to browser
document.addEventListener('DOMContentLoaded', () => {
    const ref = localStorage.getItem('todoItems');
    if (ref) {
        todoItems = JSON.parse(ref);
        todoItems.forEach((m, index) => {
            m.forEach(t => {
                renderTodo(t, index)
            })
                
        });
    }
});

