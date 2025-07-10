from src.models.user import db
from datetime import datetime

class EducationalContent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    file_path = db.Column(db.String(500), nullable=True)
    content_type = db.Column(db.String(50), nullable=False)
    upload_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    # Relacionamento com User
    author = db.relationship('User', backref=db.backref('educational_contents', lazy=True))

    def __repr__(self):
        return f'<EducationalContent {self.title}>'

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'file_path': self.file_path,
            'content_type': self.content_type,
            'upload_date': self.upload_date.isoformat() if self.upload_date else None,
            'author_id': self.author_id,
            'author_username': self.author.username if self.author else None
        }

