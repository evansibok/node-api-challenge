import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [ projects, setProjects ] = useState([]);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(projects => {
        setProjects(projects)
      })
      .catch(error => console.error(error.message));
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h4>These are the lists of projects!</h4>

        {
          projects.map(project => (
            <div>
              <h3>Project Name: {project.name}</h3>
              <h3>Project Description: {project.description}</h3>
            </div>
          ))
        }
      </header>
    </div>
  );
}

export default App;
