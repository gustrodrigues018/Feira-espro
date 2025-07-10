import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProgrammingChallenges({ user }) {
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await axios.get('/api/programming-challenges');
      setChallenges(response.data);
    } catch (error) {
      setError('Erro ao carregar desafios');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (challengeId) => {
    try {
      const response = await axios.get(`/api/code-submissions/challenge/${challengeId}`);
      setSubmissions(response.data);
    } catch (error) {
      console.error('Erro ao carregar submissões:', error);
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('');

    try {
      const response = await axios.post('/api/execute-code', {
        code: code,
        input: ''
      });

      if (response.data.success) {
        setOutput(`Execução bem-sucedida!\nSaída: ${response.data.output}`);
      } else {
        setOutput(`Erro na execução:\n${response.data.error}`);
      }
    } catch (error) {
      setOutput('Erro ao executar código');
      console.error('Erro:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!selectedChallenge || !code.trim()) {
      alert('Por favor, escreva algum código antes de submeter.');
      return;
    }

    setIsRunning(true);
    setOutput('');

    try {
      const response = await axios.post('/api/code-submissions', {
        challenge_id: selectedChallenge.id,
        code: code
      });

      const { submission, results, all_passed } = response.data;

      let resultText = `Submissão ${all_passed ? 'APROVADA' : 'REPROVADA'}!\n\n`;
      
      results.forEach((result, index) => {
        resultText += `Teste ${result.test_case}:\n`;
        resultText += `  Entrada: ${result.input || '(vazio)'}\n`;
        resultText += `  Esperado: ${result.expected}\n`;
        resultText += `  Obtido: ${result.actual || 'Erro'}\n`;
        resultText += `  Status: ${result.passed ? '✅ PASSOU' : '❌ FALHOU'}\n`;
        if (result.error) {
          resultText += `  Erro: ${result.error}\n`;
        }
        resultText += '\n';
      });

      setOutput(resultText);
      fetchSubmissions(selectedChallenge.id);
    } catch (error) {
      setOutput('Erro ao submeter código');
      console.error('Erro:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'fácil': return '#28a745';
      case 'médio': return '#ffc107';
      case 'difícil': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const selectChallenge = (challenge) => {
    setSelectedChallenge(challenge);
    setCode('');
    setOutput('');
    fetchSubmissions(challenge.id);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando desafios...</p>
        </div>
      </div>
    );
  }

  if (selectedChallenge) {
    return (
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <button 
            onClick={() => setSelectedChallenge(null)}
            className="btn btn-secondary"
          >
            ← Voltar para Desafios
          </button>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <h2 className="section-title">{selectedChallenge.title}</h2>
            <div style={{ marginBottom: '1rem' }}>
              <span 
                style={{ 
                  background: getDifficultyColor(selectedChallenge.difficulty),
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}
              >
                {selectedChallenge.difficulty}
              </span>
            </div>
            
            <h4>Descrição:</h4>
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
              {selectedChallenge.description}
            </p>

            <h4>Formato de Entrada:</h4>
            <p style={{ marginBottom: '1rem', fontFamily: 'monospace', background: '#f8f9fa', padding: '0.5rem', borderRadius: '4px' }}>
              {selectedChallenge.input_format || 'Não especificado'}
            </p>

            <h4>Formato de Saída:</h4>
            <p style={{ marginBottom: '1.5rem', fontFamily: 'monospace', background: '#f8f9fa', padding: '0.5rem', borderRadius: '4px' }}>
              {selectedChallenge.output_format || 'Não especificado'}
            </p>

            <h4>Casos de Teste:</h4>
            {selectedChallenge.test_cases && selectedChallenge.test_cases.length > 0 ? (
              selectedChallenge.test_cases.map((testCase, index) => (
                <div key={index} style={{ marginBottom: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                  <div><strong>Entrada:</strong> {testCase.input || '(vazio)'}</div>
                  <div><strong>Saída Esperada:</strong> {testCase.expected_output}</div>
                </div>
              ))
            ) : (
              <p>Nenhum caso de teste disponível</p>
            )}

            {submissions.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <h4>Suas Submissões:</h4>
                {submissions.map((submission, index) => (
                  <div key={submission.id} style={{ 
                    padding: '0.5rem', 
                    margin: '0.5rem 0', 
                    background: submission.status === 'aprovado' ? '#d4edda' : '#f8d7da',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}>
                    #{index + 1} - {submission.status} - {new Date(submission.submission_date).toLocaleString('pt-BR')}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="section-title">💻 Editor de Código</h3>
            
            <div className="form-group">
              <label className="form-label">Seu Código Python:</label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="form-textarea"
                style={{ 
                  minHeight: '300px', 
                  fontFamily: 'monospace',
                  fontSize: '14px'
                }}
                placeholder="# Escreva seu código Python aqui
print('Olá, Mundo!')"
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <button 
                onClick={handleRunCode}
                className="btn btn-secondary"
                disabled={isRunning}
              >
                {isRunning ? 'Executando...' : '▶️ Testar Código'}
              </button>

              <button 
                onClick={handleSubmitCode}
                className="btn btn-success"
                disabled={isRunning}
              >
                {isRunning ? 'Submetendo...' : '📤 Submeter Solução'}
              </button>
            </div>

            {output && (
              <div>
                <h4>Resultado:</h4>
                <pre style={{ 
                  background: '#2d3748', 
                  color: '#e2e8f0', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  maxHeight: '300px',
                  overflow: 'auto'
                }}>
                  {output}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">💻 Portal de Programação</h1>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
      
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 className="section-title">🎯 Bem-vindo ao Portal de Programação!</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
          Aqui você pode praticar suas habilidades de programação com desafios interativos. 
          Escolha um desafio abaixo e comece a codificar!
        </p>
        <div className="alert alert-info">
          <strong>Como funciona:</strong> Escreva seu código Python, teste-o e submeta sua solução. 
          O sistema executará automaticamente contra os casos de teste.
        </div>
      </div>

      <h2 className="section-title">📋 Desafios Disponíveis</h2>
      
      {challenges.length === 0 ? (
        <div className="card">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>Nenhum desafio disponível</h3>
            <p>Ainda não há desafios de programação cadastrados.</p>
            {(user.role === 'professor' || user.role === 'admin') && (
              <p>Como professor, você pode ser o primeiro a criar um desafio!</p>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-3">
          {challenges.map(challenge => (
            <div key={challenge.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>{challenge.title}</h3>
                <span 
                  style={{ 
                    background: getDifficultyColor(challenge.difficulty),
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}
                >
                  {challenge.difficulty}
                </span>
              </div>
              
              <p style={{ marginBottom: '1rem', lineHeight: '1.6', color: '#666' }}>
                {challenge.description}
              </p>

              <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1.5rem' }}>
                Por: {challenge.created_by_username} | {new Date(challenge.created_date).toLocaleDateString('pt-BR')}
              </div>

              <button 
                onClick={() => selectChallenge(challenge)}
                className="btn btn-primary btn-full"
              >
                Resolver Desafio
              </button>
            </div>
          ))}
        </div>
      )}

      {(user.role === 'professor' || user.role === 'admin') && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h3 className="section-title">👨‍🏫 Área do Professor</h3>
          <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Como professor, você pode criar novos desafios de programação para seus alunos. 
            Use a API para adicionar desafios ou implemente uma interface de criação.
          </p>
          <div className="alert alert-info">
            <strong>Para criar desafios:</strong> Use o endpoint POST /api/programming-challenges 
            com os dados do desafio (título, descrição, casos de teste, etc.)
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgrammingChallenges;

