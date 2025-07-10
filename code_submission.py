from src.models.user import db
from datetime import datetime

class CodeSubmission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    challenge_id = db.Column(db.Integer, db.ForeignKey('programming_challenge.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    submitted_code = db.Column(db.Text, nullable=False)
    submission_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    status = db.Column(db.String(20), nullable=False, default='pendente')
    output = db.Column(db.Text, nullable=True)
    error_message = db.Column(db.Text, nullable=True)

    # Relacionamentos
    challenge = db.relationship('ProgrammingChallenge', backref=db.backref('submissions', lazy=True))
    user = db.relationship('User', backref=db.backref('code_submissions', lazy=True))

    def __repr__(self):
        return f'<CodeSubmission {self.id} - {self.status}>'

    def to_dict(self):
        return {
            'id': self.id,
            'challenge_id': self.challenge_id,
            'challenge_title': self.challenge.title if self.challenge else None,
            'user_id': self.user_id,
            'username': self.user.username if self.user else None,
            'submitted_code': self.submitted_code,
            'submission_date': self.submission_date.isoformat() if self.submission_date else None,
            'status': self.status,
            'output': self.output,
            'error_message': self.error_message
        }

