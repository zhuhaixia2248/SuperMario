// 极简待办清单 - 核心逻辑实现
// 开发者B：负责交互逻辑与数据处理

// 任务数据存储
let tasks = [];

// DOM元素
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
    
    // 绑定事件监听器
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});

// 从localStorage加载任务
function loadTasks() {
    const savedTasks = localStorage.getItem('simpleTodoTasks');
    if (savedTasks) {
        try {
            tasks = JSON.parse(savedTasks);
        } catch (error) {
            console.error('加载任务数据失败:', error);
            tasks = [];
        }
    }
}

// 保存任务到localStorage
function saveTasks() {
    try {
        localStorage.setItem('simpleTodoTasks', JSON.stringify(tasks));
    } catch (error) {
        console.error('保存任务数据失败:', error);
    }
}

// 添加新任务
function addTask() {
    const content = taskInput.value.trim();
    
    if (!content) {
        alert('请输入任务内容！');
        return;
    }
    
    const newTask = {
        id: Date.now(), // 使用时间戳作为唯一ID
        content: content,
        done: false
    };
    
    tasks.unshift(newTask); // 添加到数组开头，新任务显示在前面
    
    taskInput.value = ''; // 清空输入框
    saveTasks();
    renderTasks();
}

// 删除任务
function deleteTask(taskId) {
    const index = tasks.findIndex(task => task.id === taskId);
    if (index !== -1) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
}

// 切换任务完成状态
function toggleTaskStatus(taskId) {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.done = !task.done;
        saveTasks();
        renderTasks();
    }
}

// 渲染任务列表
function renderTasks() {
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<li style="text-align: center; color: #999; padding: 20px;">暂无待办任务</li>';
        return;
    }
    
    tasks.forEach(task => {
        const taskItem = createTaskElement(task);
        taskList.appendChild(taskItem);
    });
}

// 创建任务DOM元素
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.done ? 'completed' : ''}`;
    li.dataset.taskId = task.id;
    
    // 任务文本
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.content;
    
    // 删除按钮
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '删除';
    deleteBtn.onclick = (e) => {
        e.stopPropagation(); // 阻止事件冒泡，避免触发任务点击
        deleteTask(task.id);
    };
    
    // 点击任务项切换完成状态
    li.onclick = () => {
        toggleTaskStatus(task.id);
    };
    
    li.appendChild(taskText);
    li.appendChild(deleteBtn);
    
    return li;
}

// 清空所有任务（可选功能）
function clearAllTasks() {
    if (confirm('确定要清空所有任务吗？')) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
}