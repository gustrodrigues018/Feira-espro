from src.models.user import db
from datetime import datetime
import json

class ProgrammingChallenge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    input_format = db.Column(db.Text, nullable=True)
    output_format = db.Column(db.Text, nullable=True)
    test_cases = db.Column(db.Text, nullable=False)  # JSON string
    difficulty = db.Column(db.String(20), nullable=False, default='fácil')
    created_by_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # Relacionamento com User
    created_by = db.relationship('User', backref=db.backref('programming_challenges', lazy=True))

    def __repr__(self):
        return f'<ProgrammingChallenge {self.title}>'

    def get_test_cases(self):
        """Retorna os casos de teste como lista de dicionários"""
        try:
            return json.loads(self.test_cases)
        except:
            return []

    def set_test_cases(self, test_cases_list):
        """Define os casos de teste a partir de uma lista de dicionários"""
        self.test_cases = json.dumps(test_cases_list)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'input_format': self.input_format,
            'output_format': self.output_format,
            'test_cases': self.get_test_cases(),
            'difficulty': self.difficulty,
            'created_by_id': self.created_by_id,
            'created_by_username': self.created_by.username if self.created_by else None,
            'created_date': self.created_date.isoformat() if self.created_date else None
        }

