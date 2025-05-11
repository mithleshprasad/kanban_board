import React, { useState, useEffect } from 'react';
import { Button, Card, ListGroup, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Boards = () => {
  const [boards, setBoards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/boards', {
        withCredentials: true
      });
      setBoards(response.data);
    } catch (error) {
      console.error('Failed to fetch boards:', error);
    }
  };

  const createBoard = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/boards',
        { title: newBoardTitle },
        { withCredentials: true }
      );
      setBoards([...boards, response.data]);
      setNewBoardTitle('');
      setShowModal(false);
    } catch (error) {
      console.error('Failed to create board:', error);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Your Boards</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Create New Board
        </Button>
      </div>

      <div className="row">
        {boards.map(board => (
          <div key={board._id} className="col-md-4 mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{board.title}</Card.Title>
                <Button 
                  variant="outline-primary" 
                  onClick={() => navigate(`/boards/${board._id}`)}
                >
                  Open
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Board</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Board Title</Form.Label>
              <Form.Control
                type="text"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                placeholder="Enter board title"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={createBoard}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Boards;