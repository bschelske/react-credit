import { useState } from 'react'
import { ArrowUp, ArrowDown, X } from 'lucide-react';
import './App.css'

function App() {
  const [names, setNames] = useState(['First Author', 'Second Author']);
  const [newName, setNewName] = useState('');
  const [selectedName, setSelectedName] = useState('');

  // This object will store roles for each name
  const [nameRoles, setNameRoles] = useState({
    'First Author': ['Conceptualization', 'Writing – original draft'],
    'Second Author': ['Data curation'],
  });

  function moveNameUp(index) {
    if (index === 0) return;
    const newNames = [...names];
    [newNames[index - 1], newNames[index]] = [newNames[index], newNames[index - 1]];
    setNames(newNames);
  }

  function moveNameDown(index) {
    if (index === names.length - 1) return;
    const newNames = [...names];
    [newNames[index + 1], newNames[index]] = [newNames[index], newNames[index + 1]];
    setNames(newNames);
  }

  function addName() {
    if (newName.trim()) {
      setNames([...names, newName.trim()]);
      setNameRoles(prev => ({
        ...prev,
        [newName.trim()]: [] // Initialize with empty roles array
      }));
      setNewName('');
    }
  }

  function removeName(index) {
    const nameToRemove = names[index];
    setNames(names.filter((_, i) => i !== index));

    // Also remove from nameRoles object
    setNameRoles(prev => {
      const newRoles = { ...prev };
      delete newRoles[nameToRemove];
      return newRoles;
    });

    // If the removed name was selected, clear selection
    if (selectedName === nameToRemove) {
      setSelectedName('');
    }
  }

  function toggleRole(role) {
    if (!selectedName) return; // Don't do anything if no name is selected

    setNameRoles(prev => ({
      ...prev,
      [selectedName]: prev[selectedName]?.includes(role)
        ? prev[selectedName].filter(r => r !== role)  // remove if already selected
        : [...(prev[selectedName] || []), role]        // add if not selected
    }));
  }

  const allRoles = [
    'Conceptualization', 'Resources', 'Data curation', 'Software',
    'Formal analysis', 'Supervision', 'Funding acquisition', 'Validation',
    'Investigation', 'Visualization', 'Methodology', 'Writing – original draft',
    'Project administration', 'Writing – review & editing'
  ];

  // Generate the output text
  function generateOutput() {
    return names.map((name, i) => {
      const roles = nameRoles[name] || [];
      return (
        <span key={name}>
          <b>{name}</b>: {roles.length > 0 ? roles.join(', ') : 'No roles assigned.'}.
          {i < names.length - 1 && ' '}
        </span>
      );
    });
  }

  // Make a copyable text output
  function getTextOutput() {
    return names.map(name => {
      const roles = nameRoles[name] || [];
      return `${name}: ${roles.length > 0 ? roles.join(', ') : 'No roles assigned.'}.`;
    }).join(' ');
  }

  return (
    <>
      <h1>Contributor Role Taxonomy (CRediT) Generator</h1>
      <h3>Instructions</h3>
      <p>Enter the names of contributors, then click on their names to assign roles.</p>
      <p><a href="https://credit.niso.org/" target="_blank" rel="noopener noreferrer">What is CRediT?</a></p>
      <div className="container">
        <div className="app-container">
          <div className='name-section'>
            <h3>Contributors</h3>
            <div className="name-input">
              <div className='name'>
                <input className='name-input-field'
                  type="text"
                  placeholder="Enter contributor's name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addName();
                    }
                  }}
                />
                <button className='add-button' onClick={addName}>Add</button>
              </div>

              <ol>
                {names.map((name, index) => (
                  <li key={index}>
                    <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', flex: 1 }}>
                      <input
                        type="radio"
                        name="selectedName"
                        checked={selectedName === name}
                        onChange={() => setSelectedName(name)}
                        style={{ marginRight: '8px' }}
                      />
                      <span style={{ fontWeight: selectedName === name ? 'bold' : 'normal' }}>
                        {name}
                      </span>
                      {nameRoles[name]?.length > 0 && (
                        <span style={{ color: '#666', fontSize: '0.8em', marginLeft: '8px' }}>
                          ({nameRoles[name].length} roles)
                        </span>
                      )}
                    </label>
                    <div className='name-item-controls'>
                      <button
                        className='move-button'
                        onClick={() => moveNameUp(index)}
                      ><ArrowUp size={24} strokeWidth={2} />
                      </button>
                      <button
                        className='move-button'
                        onClick={() => moveNameDown(index)}
                      >
                        <ArrowDown size={24} strokeWidth={2} />
                      </button>
                      <button
                        className='remove-button'
                        onClick={() => removeName(index)}><X size={24} strokeWidth={2} />
                      </button>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Something annoying happens here where if no name is selected the phrase "select a contributor appears, and takes up one line. When a name is picked, the name appears, and takes up two lines, while shifting all role buttons down." */}
          <div className="roles-section">
            <h3>
              Roles for: {selectedName ? selectedName : '(Select a contributor)'}
            </h3>
            {selectedName && (
              <p style={{ color: '#666', fontSize: '0.9em', marginBottom: '15px' }}>
                Current roles: {nameRoles[selectedName]?.length || 0}
              </p>
            )}


            <div className="role-buttons">

              {allRoles.map(role => (
                <button
                  key={role}
                  className={`role-button ${selectedName && nameRoles[selectedName]?.includes(role) ? 'selected' : ''}`}
                  onClick={() => toggleRole(role)}
                  disabled={!selectedName}
                  style={{ opacity: selectedName ? 1 : 0.5 }}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>

        <h3>Output</h3>
        <div className="output">
          <div>
            {generateOutput()}
          </div>
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(getTextOutput())}
          style={{ margin: 'auto', padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', maxWidth: '200px' }}
        >
          Copy to Clipboard
        </button>
      </div >

      <div className="footer">
        <p>
          This tool incorporates content from the Contributor Role Taxonomy (CRediT), which is © NISO and licensed under{' '}
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">
            Creative Commons Attribution 4.0 International (CC BY 4.0)
          </a>.
        </p>
        <p>
          Also see the{' '}
          <a href="https://credit.metabolomics.fgu.cas.cz/" target="_blank" rel="noopener noreferrer">
            CRediT Generator app by IPHYS-Bioinformatics
          </a>, which supports XML and JSON input/output.
        </p>
        <p>
          Built by{' '}
          <a href="https://benschelske.com/?utm_source=credit-generator&utm_medium=footer&utm_campaign=credit" target="_blank" rel="noopener noreferrer">
            Ben Schelske, 2025
          </a>{' '}
          · Source on{' '}
          <a href="https://github.com/bschelske/react-credit" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>.
        </p>
      </div>

    </>
  );
}

export default App