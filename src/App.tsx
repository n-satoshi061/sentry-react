import './App.css';
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";
import { ComponentA } from './components/ComponentA';

function App() {
  const methodDoesNotExist =(): void => {
    throw new Error('Function not implemented.');
  }


  const logError = (error: Error) => {
    // Do something with the error, e.g. log to an external API

  };

  function ErrorFallback({ error }: any) {
    const { resetBoundary } = useErrorBoundary();
  
    return (
      <div role="alert">
        <p>Something went wrong:</p>
        <pre style={{ color: "red" }}>{error.message}</pre>
        <button onClick={resetBoundary}>Try again</button>
      </div>
    );
  }

  return (
    <div className="App">
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
        <ComponentA />
      </ErrorBoundary>
    </div>
  );
}

export default App;
