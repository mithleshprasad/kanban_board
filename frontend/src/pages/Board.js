import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button, Card, Form, Modal, Badge } from 'react-bootstrap';
import axios from 'axios';

const statuses = ['todo', 'in-progress', 'done'];

const Board = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [currentTask, setCurrentTask] = useState({
    _id: '',
    title: '',
    description: '',
    status: 'todo'
  });
  const [boardTitle, setBoardTitle] = useState('');

  useEffect(() => {
    fetchTasks();
    fetchBoardTitle();
  }, [boardId]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tasks/${boardId}`, {
        withCredentials: true
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const fetchBoardTitle = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/boards/${boardId}`, {
        withCredentials: true
      });
      setBoardTitle(response.data.title);
    } catch (error) {
      console.error('Failed to fetch board title:', error);
    }
  };

  const handleTaskClick = (task) => {
    setCurrentTask(task);
    setShowTaskModal(true);
  };

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask(prev => ({ ...prev, [name]: value }));
  };

  const saveTask = async () => {
    try {
      if (currentTask._id) {
        // Update existing task
        await axios.put(
          `http://localhost:5000/api/tasks/${currentTask._id}`,
          currentTask,
          { withCredentials: true }
        );
      } else {
        // Create new task
        await axios.post(
          'http://localhost:5000/api/tasks',
          { ...currentTask, boardId },
          { withCredentials: true }
        );
      }
      fetchTasks();
      setShowTaskModal(false);
      setCurrentTask({ _id: '', title: '', description: '', status: 'todo' });
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        withCredentials: true
      });
      fetchTasks();
      setShowTaskModal(false);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) return;

    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${draggableId}/status`,
        { status: destination.droppableId },
        { withCredentials: true }
      );
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'todo': 'secondary',
      'in-progress': 'warning',
      'done': 'success'
    };
    return variants[status] || 'secondary';
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{boardTitle}</h2>
        <Button variant="primary" onClick={() => {
          setCurrentTask({ _id: '', title: '', description: '', status: 'todo' });
          setShowTaskModal(true);
        }}>
          Add Task
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="row">
          {statuses.map(status => (
            <div key={status} className="col-md-4">
              <Card>
                <Card.Header className="text-capitalize">
                  {status.replace('-', ' ')}
                </Card.Header>
                <Card.Body>
                  <Droppable droppableId={status}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{ minHeight: '100px' }}
                      >
                        {tasks
                          .filter(task => task.status === status)
                          .map((task, index) => (
                            <Draggable key={task._id} draggableId={task._id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="mb-3"
                                >
                                  <Card onClick={() => handleTaskClick(task)} style={{ cursor: 'pointer' }}>
                                    <Card.Body>
                                      <div className="d-flex justify-content-between">
                                        <Card.Title>{task.title}</Card.Title>
                                        <Badge bg={getStatusBadge(task.status)} className="text-capitalize">
                                          {task.status.replace('-', ' ')}
                                        </Badge>
                                      </div>
                                      <Card.Text className="text-truncate">{task.description}</Card.Text>
                                    </Card.Body>
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Task Modal */}
      <Modal show={showTaskModal} onHide={() => setShowTaskModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentTask._id ? 'Edit Task' : 'Add Task'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={currentTask.title}
                onChange={handleTaskChange}
                placeholder="Enter task title"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={currentTask.description}
                onChange={handleTaskChange}
                placeholder="Enter task description"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={currentTask.status}
                onChange={handleTaskChange}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.replace('-', ' ')}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {currentTask._id && (
            <Button variant="danger" onClick={() => deleteTask(currentTask._id)}>
              Delete
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowTaskModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveTask}>
            {currentTask._id ? 'Update' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Board;