import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddContent({ user }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content_type: 'text',
    file_path: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/api/educational-content', formData);
      setSuccess('Conteúdo adicionado com sucesso!');
      
      // Limpar formulário
      setFormData({
        title: '',
        description: '',
        content_type: 'text',
        file_path: ''
      });

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/content');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || 'Erro ao adicionar conteúdo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">➕ Adicionar Conteúdo Didático</h1>
      
      <div className="form-container" style={{ maxWidth: '600px' }}>
        <div className="card">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Título do Material:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Ex: Introdução ao JavaScript"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de Conteúdo:</label>
              <select
                name="content_type"
                value={formData.content_type}
                onChange={handleChange}
                className="form-select"
              >
                <option value="text">Texto</option>
                <option value="pdf">PDF</option>
                <option value="video">Vídeo</option>
                <option value="image">Imagem</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Descrição:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Descreva o conteúdo do material..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Link/Caminho do Arquivo:</label>
              <input
                type="url"
                name="file_path"
                value={formData.file_path}
                onChange={handleChange}
                className="form-input"
                placeholder="https://exemplo.com/arquivo.pdf ou caminho local"
              />
              <small style={{ color: '#666', fontSize: '0.9rem' }}>
                Insira a URL do arquivo ou o caminho onde está hospedado
              </small>
            </div>

            <div className="form-group">
              <button 
                type="submit" 
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? 'Adicionando...' : 'Adicionar Conteúdo'}
              </button>
            </div>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button 
              onClick={() => navigate('/content')}
              className="btn btn-secondary"
            >
              Voltar para Conteúdos
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 className="section-title">💡 Dicas para Adicionar Conteúdo</h3>
        <ul style={{ lineHeight: '1.8', paddingLeft: '2rem' }}>
          <li><strong>Título:</strong> Use um título claro e descritivo</li>
          <li><strong>Tipo:</strong> Escolha o tipo correto para melhor organização</li>
          <li><strong>Descrição:</strong> Explique brevemente o que o aluno aprenderá</li>
          <li><strong>Arquivo:</strong> Certifique-se de que o link está acessível</li>
        </ul>
      </div>
    </div>
  );
}

export default AddContent;

