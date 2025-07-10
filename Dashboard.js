import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard({ user }) {
  return (
    <div className="container">
      <h1 className="page-title">
        Bem-vindo ao Portal Espro, {user.username}!
      </h1>
      
      <div className="grid grid-2">
        <div className="card">
          <h3 className="section-title">📚 Conteúdos Didáticos</h3>
          <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Acesse materiais de estudo, vídeos, documentos e outros recursos educacionais 
            disponibilizados pelos professores.
          </p>
          <Link to="/content" className="btn btn-primary">
            Ver Conteúdos
          </Link>
        </div>

        <div className="card">
          <h3 className="section-title">💻 Portal de Programação</h3>
          <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Pratique suas habilidades de programação com desafios e exercícios 
            interativos. Teste seu código em tempo real!
          </p>
          <Link to="/programming" className="btn btn-primary">
            Ir para Programação
          </Link>
        </div>

        {(user.role === 'professor' || user.role === 'admin') && (
          <div className="card">
            <h3 className="section-title">➕ Adicionar Conteúdo</h3>
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Como professor, você pode adicionar novos materiais didáticos 
              para seus alunos acessarem.
            </p>
            <Link to="/add-content" className="btn btn-success">
              Adicionar Material
            </Link>
          </div>
        )}

        <div className="card">
          <h3 className="section-title">👤 Seu Perfil</h3>
          <div style={{ marginBottom: '1.5rem' }}>
            <p><strong>Nome:</strong> {user.username}</p>
            <p><strong>E-mail:</strong> {user.email}</p>
            <p><strong>Tipo:</strong> {user.role}</p>
          </div>
          <div className="alert alert-info">
            Você está logado como <strong>{user.role}</strong>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 className="section-title">🎯 Sobre o Portal Espro</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
          O Portal Espro é uma plataforma de aprendizado completa que oferece:
        </p>
        <ul style={{ lineHeight: '1.8', paddingLeft: '2rem' }}>
          <li>Acesso a materiais didáticos organizados</li>
          <li>Portal de programação com desafios interativos</li>
          <li>Sistema de autenticação seguro</li>
          <li>Interface responsiva e moderna</li>
          <li>Diferentes níveis de acesso (aluno, professor, admin)</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;

