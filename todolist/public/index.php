<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/style.css?v<?=time()?>">
    <title>To-do</title>
</head>
<body>
<div class="wrapper">
    <h1>Список задач</h1>

    <div class="container">
        <div class="add_task_container">
            <div class="add_task" id="addTask">Добавить задачу</div>
        </div>

        <div class="to-do_list">
            <div class="task_list">
            </div>

        </div>
    </div>
</div>
<br>
<div id="getAllTask"> </div>
<script src="script/jquery.js"></script>
<script src="script/app.js?v<?=time()?>"></script>
<script src="script/edit.js?v<?=time()?>"></script>
</body>
</html>