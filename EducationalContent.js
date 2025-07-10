import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EducationalContent({ user }) {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await axios.get('/api/educational-content');
      setContents(response.data);
    } catch (error) {
      setError('Erro ao carregar conteúdos');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (contentId) => {
    if (window.confirm('Tem certeza que deseja deletar este conteúdo?')) {
      try {
        await axios.delete(`/api/educational-content/${contentId}`);
        setContents(contents.filter(content => content.id !== contentId));
      } catch (error) {
        setError('Erro ao deletar conteúdo');
        console.error('Erro:', error);
      }
    }
  };

  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'video': return '🎥';
      case 'text': return '📝';
      case 'image': return '🖼️';
      default: return '📁';
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando conteúdos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">📚 Conteúdos Didáticos</h1>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {contents.length === 0 ? (
        <div className="card">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>Nenhum conteúdo disponível</h3>
            <p>Ainda não há materiais didáticos cadastrados.</p>
            {(user.role === 'professor' || user.role === 'admin') && (
              <p>Como professor, você pode ser o primeiro a adicionar conteúdo!</p>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-2">
          {contents.map(content => (
            <div key={content.id} className="card">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem', marginRight: '1rem' }}>
                  {getContentTypeIcon(content.content_type)}
                </span>
                <div>
                  <h3 className="content-title">{content.title}</h3>
                  <div className="content-meta">
                    Por: {content.author_username} | 
                    Tipo: {content.content_type} | 
                    {new Date(content.upload_date).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
              
              {content.description && (
                <p className="content-description" style={{ marginBottom: '1.5rem' }}>
                  {content.description}
                </p>
              )}

              {content.file_path && (
                <div style={{ marginBottom: '1rem' }}>
                  <a 
                    href={content.file_path} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ marginRight: '1rem' }}
                  >
                    Abrir Material
                  </a>
                </div>
              )}

              {(user.role === 'admin' || content.author_id === user.id) && (
                <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem', marginTop: '1rem' }}>
                  <button 
                    onClick={() => handleDelete(content.id)}
                    className="btn btn-danger"
                    style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                  >
                    Deletar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EducationalContent;

