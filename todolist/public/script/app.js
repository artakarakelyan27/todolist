// Переменные
// Функция добавления формы для задачи
function addTask() {
    $('.edit_form').hide(); // Скрываем все формы
    $('#addTask').css('display', 'block');
    $('.add_subtask').css('display', 'block');

    let form = `
        <form id="addTaskForm" class="edit_form">
            <div class="task_name">
                <input type="text" value="Заголовок задачи" name="title" required>
            </div>
            <div class="task_description">
                <textarea placeholder="Опиание задачи" name="description"></textarea>
            </div>
            <button type="submit">Сохранить</button>
            <div class="cancel">Отменить</div>
        </form>
    `;
    $('.to-do_list').prepend(form);
    $('.container').get(0).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Функция добавления формы для подзадачи
function addSubtask(parentElement) {
    $('.edit_form').hide(); // Скрываем все формы
    $('#addTask').css('display', 'block');
    $('.add_subtask').css('display', 'block');

    let form = `
        <form id="addSubtaskForm" class="edit_form">
            <div class="task_name">
                <input type="text" value="Заголовок подзадачи" name="title" required>
            </div>
            <div class="task_description">
                <textarea placeholder="Описание подзадачи" name="description"></textarea>
            </div>
            <button type="submit">Сохранить</button>
            <div class="cancel">Отменить</div>
        </form>
    `;
    $(parentElement).closest('.task').find('.subtask_list').append(form);
    $('#addSubtaskForm').get(0).scrollIntoView({ behavior: 'smooth', block: 'center' });

}

// Обработчик добавления задачи
$('#addTask').on('click', function () {
    addTask();
    $(this).css('display', 'none');
});

// Обработчик добавления подзадачи
$(document).on('click', '.add_subtask', function () {
    addSubtask(this);
    $(this).css('display', 'none');
});

// Обработчик отмены формы
$(document).on('click', '.cancel', function () {
    $(this).closest('.edit_form').remove();
    $('#addTask').css('display', 'block');
    $('.add_subtask').css('display', 'block');
});

// Обработчик отправки формы задачи
$(document).on('submit', '#addTaskForm', function (e) {
    e.preventDefault();
    sendForm(this);
});

// Обработчик отправки формы подзадачи
$(document).on('submit', '#addSubtaskForm', function (e) {
    e.preventDefault();
    sendForm(this, true);
});

// Функция отправки данных на сервер
function sendForm(form, isSubtask = false) {
    let parentID = isSubtask ? $(form).closest('.task').attr('id').split('-')[1] : null;

    const data = {
        title: $(form).find('input[name="title"]').val().trim(),
        description: $(form).find('textarea[name="description"]').val().trim(),
        parentID: parentID
    };

    $.ajax({
        url: "/api/tasks.php",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (response) {
            if (response.status === 'success') {
                // Добавляем новую задачу/подзадачу в DOM
                if (isSubtask) {
                    const subtaskHtml = `
                        <div class="subtask" id="subtask-${response.data.id}">
                            <div class="tools">
                                <div class="delete_subtask" data-subtask-id="${response.data.id}">❌</div>
                                <div class="edit_subtask" data-subtask-id="${response.data.id}">🖊</div>
                                <div class="done_task" data-subtask-id="${response.data.id}">✅</div>
                            </div>
                            <div class="subtask_name">${data.title}</div>
                            <div class="subtask_description">${data.description}</div>
                        </div>
                    `;
                    $(form).closest('.subtask_list').append(subtaskHtml);
                } else {
                    const taskHtml = `
                        <div class="task" id="task-${response.data.id}">
                            <div class="tools">
                                <div class="delete_task" data-task-id="${response.data.id}">❌</div>
                                <div class="edit_task" data-task-id="${response.data.id}">🖊</div>
                                <div class="done_task" data-task-id="${response.data.id}">✅</div>
                            </div>
                            <div class="task_name">${data.title}</div>
                            <div class="task_description">${data.description}</div>
                            <div class="subtask_list"></div>
                            <div class="add_subtask" data-task-id="${response.data.id}">Добавить подзадачу </div>
                        </div>
                    `;
                    $('.task_list').prepend(taskHtml);
                }
                $(form).remove();
                $('#addTask').css('display', 'block');
                $('.add_subtask').css('display', 'block');
            } else {
                alert(response.message || 'Ошибка при добавлении задачи');
            }
        },
        error: function (xhr, status, error) {
            console.log("Ошибка AJAX:", status, error);
            alert('Ошибка сервера. Попробуйте снова.');
        }
    });
}

// Обработчик удаления задачи
$(document).on('click', '.delete_task', function () {
    if (confirm('Вы уверены, что хотите удалить задачу?')) {
        const taskId = $(this).data('task-id');
        $.ajax({
            url: "/api/tasks.php",
            method: "DELETE",
            contentType: "application/json",
            data: JSON.stringify({ id: taskId }),
            dataType: "json",
            success: function (response) {
                if (response.status === 'success') {
                    $(`#task-${taskId}`).remove();
                } else {
                    alert(response.message || 'Ошибка при удалении задачи');
                }
            },
            error: function (xhr, status, error) {
                console.log("Ошибка AJAX:", status, error);
                alert('Ошибка сервера. Попробуйте снова.');
            }
        });
    }
});

// Обработчик удаления подзадачи
$(document).on('click', '.delete_subtask', function () {
    if (confirm('Вы уверены, что хотите удалить подзадачу?')) {
        const subtaskId = $(this).data('subtask-id');
        $.ajax({
            url: "/api/tasks.php",
            method: "DELETE",
            contentType: "application/json",
            data: JSON.stringify({ id: subtaskId }),
            dataType: "json",
            success: function (response) {
                if (response.status === 'success') {
                    $(`#subtask-${subtaskId}`).remove();
                } else {
                    alert(response.message || 'Ошибка при удалении подзадачи');
                }
            },
            error: function (xhr, status, error) {
                console.log("Ошибка AJAX:", status, error);
                alert('Ошибка сервера. Попробуйте снова.');
            }
        });
    }
});

// Обработчик завершения задачи/подзадачи
$(document).on('click', '.done_task', function () {
    const isSubtask = $(this).data('subtask-id') !== undefined;
    const id = isSubtask ? $(this).data('subtask-id') : $(this).data('task-id');
    const $element = isSubtask ? $(`#subtask-${id}`) : $(`#task-${id}`);

    const currentlyDone = $element.hasClass('completed');
    const newDoneState = !currentlyDone;

    $.ajax({
        url: "/api/tasks.php",
        method: "PATCH",
        contentType: "application/json",
        data: JSON.stringify({ id: id, is_done: newDoneState }),
        dataType: "json",
        success: function (response) {
            if (response.status === 'success') {
                $element.toggleClass('completed', newDoneState);
            } else {
                alert(response.message || 'Ошибка при изменении статуса задачи');
            }
        },
        error: function (xhr, status, error) {
            console.log("Ошибка AJAX:", status, error);
            alert('Ошибка сервера. Попробуйте снова.');
        }
    });
});

// Загрузка данных при старте страницы
$(window).on('load', function () {
    $.ajax({
        url: "/api/tasks.php",
        method: "GET",
        contentType: "application/json",
        success: function (response) {
            if (response.status === 'success' && Array.isArray(response.data)) {
                // Очищаем текущий список задач
                $('.task_list').empty();

                // Создаем карту подзадач по parent_id
                const subtasksByParentId = {};
                response.data.forEach(task => {
                    const parentId = task.parent_id || null;
                    if (parentId !== null) {
                        if (!subtasksByParentId[parentId]) {
                            subtasksByParentId[parentId] = [];
                        }
                        subtasksByParentId[parentId].push({
                            id: task.id,
                            title: task.title,
                            description: task.description,
                            completed: task.is_done
                        });
                    }
                });

                // Генерируем HTML только для задач верхнего уровня (parent_id = null)
                response.data.forEach(task => {
                    if (task.parent_id === null) {
                        const subtasks = subtasksByParentId[task.id] || [];
                        const taskHtml = `
                            <div class="task ${task.is_done ? 'completed' : ''}" id="task-${task.id}">
                                <div class="tools">
                                    <div class="delete_task" data-task-id="${task.id}">❌</div>
                                    <div class="edit_task" data-task-id="${task.id}">🖊</div>
                                    <div class="done_task" data-task-id="${task.id}">✅</div>
                                </div>
                                <div class="task_name">${task.title}</div>
                                <div class="task_description">${task.description}</div>
                                <div class="subtask_list">
                                    ${subtasks.map(subtask => `
                                        <div class="subtask ${subtask.completed ? 'completed' : ''}" id="subtask-${subtask.id}">
                                            <div class="tools">
                                                <div class="delete_subtask" data-subtask-id="${subtask.id}">❌</div>
                                                <div class="edit_subtask" data-subtask-id="${subtask.id}">🖊</div>
                                                <div class="done_task" data-subtask-id="${subtask.id}">✅</div>
                                            </div>
                                            <div class="subtask_name">${subtask.title}</div>
                                            <div class="subtask_description">${subtask.description}</div>
                                        </div>
                                    `).join('')}
                                </div>
                                <div class="add_subtask" data-task-id="${task.id}">Добавить подзадачу</div>
                            </div>
                        `;
                        $('.task_list').append(taskHtml);
                    }
                });
            } else {
                console.log('Ошибка при загрузке данных:', response.message || 'Неверный формат данных');
                alert('Ошибка при загрузке данных');
            }
        },
        error: function (xhr, status, error) {
            console.log("Ошибка AJAX:", status, error);
            alert('Ошибка загрузки данных с сервера');
        }
    });
});