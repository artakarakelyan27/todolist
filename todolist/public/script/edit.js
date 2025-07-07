// Переменная для отслеживания состояния редактирования
let isEditing = false;

// Функция для отключения/включения кнопок редактирования
function toggleEditButtons(disable) {
    $('.edit_task, .edit_subtask').prop('disabled', disable);
    $('.edit_task, .edit_subtask').css('opacity', disable ? '0.5' : '1');
    $('.edit_task, .edit_subtask').css('cursor', disable ? 'not-allowed' : 'pointer');
}

// Обработчик редактирования задачи
$(document).on('click', '.edit_task', function () {
    const $task = $(this).closest('.task');
    if (isEditing || $task.hasClass('completed')) return;

    isEditing = true;
    toggleEditButtons(true);

    const taskId = $(this).data('task-id');
    const $taskName = $task.find('.task_name');
    const $taskDescription = $task.find('.task_description');
    const currentTitle = $taskName.text();
    const currentDescription = $taskDescription.text();

    $taskName.html(`<input type="text" class="edit_task_name" value="${currentTitle}">`);
    $taskDescription.html(`<textarea class="edit_task_description">${currentDescription}</textarea>`);
    $(this).replaceWith(`<div class="save_task" data-task-id="${taskId}" style="cursor: pointer;">💾</div>`);
});


// Обработчик редактирования подзадачи
$(document).on('click', '.edit_subtask', function () {
    const $subtask = $(this).closest('.subtask');
    if (isEditing || $subtask.hasClass('completed')) return;

    isEditing = true;
    toggleEditButtons(true);

    const subtaskId = $(this).data('subtask-id');
    const $subtaskName = $subtask.find('.subtask_name');
    const $subtaskDescription = $subtask.find('.subtask_description');
    const currentTitle = $subtaskName.text();
    const currentDescription = $subtaskDescription.text();

    $subtaskName.html(`<input type="text" class="edit_subtask_name" value="${currentTitle}">`);
    $subtaskDescription.html(`<textarea class="edit_subtask_description">${currentDescription}</textarea>`);
    $(this).replaceWith(`<div class="save_subtask" data-subtask-id="${subtaskId}" style="cursor: pointer;">💾</div>`);
});


// Обработчик сохранения задачи
$(document).on('click', '.save_task', function () {
    const $task = $(this).closest('.task');
    const taskId = $(this).data('task-id');
    const newTitle = $task.find('.edit_task_name').val().trim();
    const newDescription = $task.find('.edit_task_description').val().trim();

    $task.find('.task_name').text(newTitle);
    $task.find('.task_description').text(newDescription);
    $(this).replaceWith(`<div class="edit_task" data-task-id="${taskId}" style="cursor: pointer;">🖊</div>`);

    saveTaskData(taskId, newTitle, newDescription);
    isEditing = false;
    toggleEditButtons(false);
});

// Обработчик сохранения подзадачи
$(document).on('click', '.save_subtask', function () {
    const $subtask = $(this).closest('.subtask');
    const subtaskId = $(this).data('subtask-id');
    const newTitle = $subtask.find('.edit_subtask_name').val().trim();
    const newDescription = $subtask.find('.edit_subtask_description').val().trim();

    $subtask.find('.subtask_name').text(newTitle);
    $subtask.find('.subtask_description').text(newDescription);
    $(this).replaceWith(`<div class="edit_subtask" data-subtask-id="${subtaskId}" style="cursor: pointer;">🖊</div>`);

    saveTaskData(subtaskId, newTitle, newDescription, true);
    isEditing = false;
    toggleEditButtons(false);
});

// Функция сохранения данных на сервере
function saveTaskData(id, title, description, isSubtask = false) {
    const data = {
        id: id,
        title: title,
        description: description
    };

    $.ajax({
        url: "/api/tasks.php", // Обновленный эндпоинт
        method: "PATCH",
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (response) {
            if (response.status !== 'success') {
                alert(response.message || 'Ошибка при сохранении данных');
            }
        },
        error: function (xhr, status, error) {
            console.log("Ошибка AJAX:", status, error);
            alert('Ошибка сервера. Попробуйте снова.');
        }
    });
}