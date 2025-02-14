import { useState } from 'react';
import reactLogo from './assets/react.svg';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import './App.css';

function App() {
  const [greetMsg, setGreetMsg] = useState('');
  const [name, setName] = useState('');
  const [inputPath, setInputPath] = useState('');
  const [outputDir, setOutputDir] = useState('');

  async function greet() {
    setGreetMsg(await invoke('greet', { name }));
  }

  async function selectInputFile() {
    const selected = await open({
      multiple: false,
      filters: [
        {
          name: 'Video',
          extensions: ['mp4', 'avi', 'mkv', 'mov'],
        },
      ],
    });

    if (selected) {
      setInputPath(selected as string);
    }
  }

  async function selectOutputDir() {
    const selected = await open({
      directory: true,
      multiple: false,
    });

    if (selected) {
      setOutputDir(selected as string);
    }
  }

  return (
    <main className="container">
      <h1>Welcome to Tauri + React</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <div className="row">
        <div>
          <button type="button" onClick={selectInputFile}>
            Select File
          </button>
          {inputPath && <p>Selected file: {inputPath}</p>}
        </div>

        <div>
          <button type="button" onClick={selectOutputDir}>
            Select Folder
          </button>
          {outputDir && <p>Output directory: {outputDir}</p>}
        </div>
      </div>

      <form
        className="row"
        onSubmit={e => {
          e.preventDefault();
          greet();
        }}
      >
        <input id="greet-input" onChange={e => setName(e.currentTarget.value)} placeholder="Enter a name..." />
        <button type="submit">Greet</button>
      </form>

      <p>{greetMsg}</p>
    </main>
  );
}

export default App;
