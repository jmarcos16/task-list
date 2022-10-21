const controls = {
  tableTask: document.getElementById("table-task-list"),
  dataTask: [],
};

const system = {
  start() {
    renderTaskDataList();
    selectItemOfList();
  },
  update() {
    renderTaskDataList();
    selectItemOfList();
  },
  setLocalStorage(dataItems) {
    localStorage.setItem("items", JSON.stringify(dataItems));
  },
  getLocalStorage() {
    const items = JSON.parse(localStorage.getItem("items"));
    if (items) {
      return items;
    } else {
      return [];
    }
  },
};

const CalculatesDifferenceOfHoursinPercentage = (Create, dueDate, ItemID) => {
  const created_at = new Date(Create);
  const DueDate = new Date(dueDate);
  DueDate.setDate(DueDate.getDate() + 3);

  let millisecondCreated = (DueDate - created_at) / 1000;
  let getSecond = millisecondCreated / 60;

  let millisecondNow = (DueDate - new Date(Date.now())) / 1000;
  let getSecondNow = millisecondNow / 60;
  let porCent = Math.round(100 - (getSecondNow * 100) / getSecond);

  const dataTask = system.getLocalStorage().forEach((item) => {
    if (item.id === ItemID && item.status === 1) {
      porCent = 100;
    }
  });

  return porCent > 100 ? 100 : porCent;
};

const createTask = () => {
  const dataTaks = system.getLocalStorage();
  const modelForm = document.querySelector("form");
  const titleTask = document.getElementById("title-task");
  const dueDate = document.getElementById("due-date");
  if ((titleTask.value, dueDate.value)) {
    dataTaks.push({
      id: Math.floor(Math.random() * 100),
      title: titleTask.value,
      status: 0,
      created_at: new Date(Date.now()),
      duedate: dueDate.value,
    });
    modelForm.reset();
    system.setLocalStorage(dataTaks);
    system.update();
  } else {
    Swal.fire({
      position: "top",
      icon: "error",
      title: "Title and date must be informed",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};

const renderTaskDataList = () => {
  const tableList = document.getElementById("table-task-list");
  const dataTask = system.getLocalStorage();
  if (dataTask.length > 0) {
    const listItem = dataTask
      .map((item) => {
        return createTaskHTML(item);
      })
      .join("");
    tableList.innerHTML = listItem;
  } else {
    tableList.innerHTML = notDataItemsHTML();
  }
};

const selectItemOfList = () => {
  let itemList = document.querySelectorAll(".item-list");

  itemList.forEach((item) => {
    item.removeEventListener("click", activeCheckboxofList);
  });
  itemList.forEach((item) => {
    item.addEventListener("click", activeCheckboxofList);
  });

  function activeCheckboxofList(element) {
    element.currentTarget.classList.toggle("selected");
    if (element.currentTarget.classList.contains("selected"))
      element.currentTarget.querySelector("input").checked = true;
    else element.currentTarget.querySelector("input").checked = false;
  }
};

const deleteTaksList = () => {
  dataTaks = system.getLocalStorage();
  selectedTask = controls.tableTask.querySelectorAll("input");
  selectedTask.forEach((item) => {
    if (item.checked === true) {
      removeItemWithID(dataTaks, item.parentNode.parentNode.id);
      system.setLocalStorage(dataTaks);
      system.update();
    }
  });
  function removeItemWithID(array, id) {
    let result = array.filter((elemento) => {
      return elemento.id == id;
    });

    for (element of result) {
      let index = array.indexOf(element);
      array.splice(index, 1);
      controls.dataTask = array;
    }
  }
};

const concludTaskList = () => {
  dataTaks = system.getLocalStorage();
  selectedTask = controls.tableTask.querySelectorAll("input");
  selectedTask.forEach((item) => {
    if (item.checked === true) {
      dataTaks.map((elemento) => {
        if (
          item.parentNode.parentNode.id == elemento.id &&
          elemento.status == 0
        ) {
          elemento.status = 1;
        } else {
          elemento.status = 0;
        }
      });
      system.setLocalStorage(dataTaks);
      system.update();
    }
  });
};

const createTaskHTML = (item) => {
  let progress = CalculatesDifferenceOfHoursinPercentage(
    item.created_at,
    item.duedate,
    item.id
  );

  let html = `
  <tr id="${item.id}" class="item-list ">
    <td>
        <input type="checkbox"></th>
    </td>
    <td>${item.title}</td>
    <td>
        <span class="progress ${
          progress === 0
            ? "pending"
            : item.status === 1
            ? "concluded"
            : "in-progress"
        }">
          
        </span>
    </td>
    <td>
        <div class="progress">
            <div class="progress-bar text-dark " role="progressbar" aria-label="Example with label" style="width: ${progress}%;"
                aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">${progress}%
            </div>
        </div>
    </td>
    <td>${item.duedate}</td>
</tr>`;

  return html;
};

const notDataItemsHTML = () => {
  let html = `<td colspan="5" style="text-align: center;">No tasks at the moment</td>`;
  return html;
};

system.start();
