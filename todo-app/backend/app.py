from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://urban-space-sniffle-5gq79q9prwq5c4rwq-5173.app.github.dev"}})

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///tasks.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100), nullable=True) # Optional field
    priority = db.Column(db.Integer, nullable=False, default = 1)
    completed = db.Column(db.Boolean, default=False)
    date_created = db.Column(db.DateTime, default=datetime.now)
    due_date = db.Column(db.DateTime, nullable=True) # Optional field

    def __repr__(self):
        return f"<Task {self.id} - {self.description}>"

with app.app_context():
    db.create_all()

@app.route("/tasks", methods=["GET"])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([
        {
            "id": t.id,
            "description": t.description,
            "category": t.category,
            "priority": t.priority,
            "completed": t.completed,
            "dateCreated": t.date_created.isoformat(),
            "dueDate": t.due_date.isoformat() if t.due_date else None
        } for t in tasks
    ])

@app.route("/tasks", methods=["POST"])
def add_task():
    data = request.json
    print("Received data:", data)  # Debugging log
    new_task = Task(
        description=data["description"],
        category=data.get("category"),
        priority=data.get("priority", 1),  # Default to 1 if not provided
        due_date=datetime.fromisoformat(data["dueDate"]) if data.get("dueDate") else None
    )
    db.session.add(new_task)
    db.session.commit()
    return jsonify({
        "id": new_task.id,
        "description": new_task.description,
        "category": new_task.category,
        "priority": new_task.priority,
        "completed": new_task.completed,
        "dateCreated": new_task.date_created.isoformat(),
        "dueDate": new_task.due_date.isoformat() if new_task.due_date else None
    })

@app.route("/tasks/<int:id>", methods=["PATCH"])
def toggle_task(id):
    task = Task.query.get(id)
    if task:
        task.completed = not task.completed
        db.session.commit()
    return jsonify({
        "id": task.id,
        "description": task.description,
        "category": task.category,
        "priority": task.priority,
        "completed": task.completed,
        "dateCreated": task.date_created.isoformat(),
        "dueDate": task.due_date.isoformat() if task.due_date else None
    })

@app.route("/tasks/<int:id>", methods=["DELETE"])
def delete_task(id):
    task = Task.query.get(id)
    if task:
        db.session.delete(task)
        db.session.commit()
    return jsonify({"message": "Task deleted"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)