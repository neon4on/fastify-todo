import fastify from 'fastify';

const server = fastify();

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

let tasks: Task[] = [];

server.get('/tasks', async (request, reply) => {
  return tasks;
});

server.get('/tasks/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const task = tasks.find(t => t.id === Number(id));
  if (!task) {
    reply.code(404);
    return { message: 'Задача не найдена' };
  }
  return task;
});

server.post('/tasks', async (request, reply) => {
  const newTask = request.body as Partial<Task>;
  const id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
  const task: Task = { id, title: newTask.title || '', completed: false };
  tasks.push(task);
  reply.code(201);
  return task;
});

server.put('/tasks/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const updatedTask = request.body as Partial<Task>;
  const taskIndex = tasks.findIndex(t => t.id === Number(id));
  if (taskIndex === -1) {
    reply.code(404);
    return { message: 'Задача не найдена' };
  }
  tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
  return tasks[taskIndex];
});

server.delete('/tasks/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const taskIndex = tasks.findIndex(t => t.id === Number(id));
  if (taskIndex === -1) {
    reply.code(404);
    return { message: 'Задача не найдена' };
  }
  tasks.splice(taskIndex, 1);
  return { message: 'Задача удалена' };
});

const start = async () => {
  try {
    await server.listen({ port: 3000 });
    console.log('Сервер запущен на порту 3000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
